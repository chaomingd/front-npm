'4.27.2';

/* eslint-disable -- hack skills */
interface InterfaceSpecialKeyCodes {
  Backspace: number;
  ShiftLeft: number;
  ControlLeft: number;
  AltLeft: number;
  ShiftRight: number;
  ControlRight: number;
  AltRight: number;
}

interface MouseButton {
  MainButton: number;
  AuxiliaryButton: number;
  SecondaryButton: number;
  FourthButton: number;
  FifthButton: number;
}

interface RECEIVE {
  QualityControlOwnership: number;
  Response: number;
  Command: number;
  FreezeFrame: number;
  UnfreezeFrame: number;
  VideoEncoderAvgQP: number;
  LatencyTest: number;
  InitialSettings: number;
}

interface SEND {
  IFrameRequest: number;
  RequestQualityControl: number;
  MaxFpsRequest: number;
  AverageBitrateRequest: number;
  StartStreaming: number;
  StopStreaming: number;
  LatencyTest: number;
  RequestInitialSettings: number;
  UIInteraction: number;
  Command: number;
  KeyDown: number;
  KeyUp: number;
  KeyPress: number;
  MouseEnter: number;
  MouseLeave: number;
  MouseDown: number;
  MouseUp: number;
  MouseMove: number;
  MouseWheel: number;
  TouchStart: number;
  TouchEnd: number;
  TouchMove: number;
}
// Must be kept in sync with JavaScriptKeyCodeToFKey C++ array.
// special keycodes different from KeyboardEvent.keyCode
const SpecialKeyCodes = {
  Backspace: 8,
  ShiftLeft: 16,
  ControlLeft: 17,
  AltLeft: 18,
  ShiftRight: 253,
  ControlRight: 254,
  AltRight: 255,
};
type KeyCode = keyof typeof SpecialKeyCodes;

// https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button
const MouseButton = {
  MainButton: 0, // Left button.
  AuxiliaryButton: 1, // Wheel button.
  SecondaryButton: 2, // Right button.
  FourthButton: 3, // Browser Back button.
  FifthButton: 4, // Browser Forward button.
};

// Must be kept in sync with PixelStreamingProtocol::EToClientMsg C++ enum.
const RECEIVE = {
  QualityControlOwnership: 0,
  Response: 1,
  Command: 2,
  FreezeFrame: 3,
  UnfreezeFrame: 4,
  VideoEncoderAvgQP: 5,
  LatencyTest: 6,
  InitialSettings: 7,
};

// Must be kept in sync with PixelStreamingProtocol::EToUE4Msg C++ enum.
const SEND = {
  /*
   * Control Messages. Range = 0..49.
   */
  IFrameRequest: 0,
  RequestQualityControl: 1,
  MaxFpsRequest: 2,
  AverageBitrateRequest: 3,
  StartStreaming: 4,
  StopStreaming: 5,
  LatencyTest: 6,
  RequestInitialSettings: 7,
  /*
   * Input Messages. Range = 50..89.
   */

  // Generic Input Messages. Range = 50..59.
  UIInteraction: 50,
  Command: 51,

  // Keyboard Input Message. Range = 60..69.
  KeyDown: 60,
  KeyUp: 61,
  KeyPress: 62,

  // Mouse Input Messages. Range = 70..79.
  MouseEnter: 70,
  MouseLeave: 71,
  MouseDown: 72,
  MouseUp: 73,
  MouseMove: 74,
  MouseWheel: 75,

  // Touch Input Messages. Range = 80..89.
  TouchStart: 80,
  TouchEnd: 81,
  TouchMove: 82,
};
type CreatePeerStreamOptions = {
  poster?: string;
  onInitialize?: () => void;
};

const customEventsArray = [
  'initialize',
  'connected',
  'disconnected',
  'tryConnect',
  'message',
  'error',
] as const;
export class PeerStream extends HTMLVideoElement {
  ws: WebSocket = { send() {}, close() {} } as any;
  pc: RTCPeerConnection = { close() {} } as any;
  VideoEncoderQP?: number;
  QualityControlOwnership?: boolean;
  InitialSettings: any;
  disablepictureinpicture?: boolean;
  dc: any;
  audio?: HTMLAudioElement;
  ping: number = -1;
  customEvents: { [K in (typeof customEventsArray)[number]]: CustomEvent } = {} as any;
  reconnect: number = -1;
  reconnectCount: number = 0;
  constructor(...params: any[]) {
    console.log(params);
    super();

    (window as any).ps = this;

    // this.ws = { send() { }, close() { } }; // WebSocket
    // this.pc = { close() { } }; // RTCPeerConnection
    this.createCustomEvents();
    this.setupVideo();
    this.registerKeyboardEvents();
    this.registerMouseHoverEvents();
    this.registerFakeMouseEvents();

    document.addEventListener(
      'pointerlockchange',
      () => {
        if ((document.pointerLockElement as any) === this) {
          this.registerPointerlockEvents();
        } else {
          this.registerMouseHoverEvents();
        }
      },
      false,
    );

    this.addEventListener('loadeddata', (e) => {
      this.style.aspectRatio = `${this.videoWidth / this.videoHeight}`;
    });
  }

  createCustomEvents() {
    for (const eventName of customEventsArray) {
      const event = new CustomEvent(eventName);
      this.customEvents[eventName] = event;
    }
  }
  // 自定义播放暂停
  customPlay() {
    this.setupWebsocket();
  }
  customPause() {
    this.dc.close();

    this.pause();
  }
  customStop() {
    this.ws.close(1000, 'Infinity');
    this.pc.close();
  }

  setupWebsocket() {
    // This will happen each time the node is moved, and may happen before the element"s contents have been fully parsed. may be called once your element is no longer connected
    if (!this.isConnected) return;

    let signal = this.getAttribute('signal');

    if (!signal) {
      const ip = this.getAttribute('ip') || location.hostname || 'localhost';
      const port = this.getAttribute('port') || 88;
      const token = this.getAttribute('token') || 'hello';
      signal = `ws://${ip}:${port}/${token}`;
    }
    // 是否需要ping，配套的是signal.js里的需要pong
    const needPing = false;

    this.ws.close(1000, 'Infinity');
    this.ws = new WebSocket(signal);

    this.ws.onerror = (e) => {
      console.log(e);
    };
    this.ws.onopen = async (e) => {
      console.info('✅ connected to', this.ws.url);

      this.setupPeerConnection();
      // If the new data channel is the first one added to the connection, renegotiation is started by delivering a negotiationneeded event.
      this.setupDataChannel();
      // this.pc.restartIce();

      clearInterval(this.ping);
      if (needPing) {
        // @ts-ignore
        this.ping = setInterval(() => {
          this.ws.send(JSON.stringify({ type: 'ping', time: Date.now() }));
        }, 1000 * 50);
      }
    };

    this.ws.onmessage = (e) => {
      this.onWebSocketMessage(e.data);
    };

    this.ws.onclose = (e) => {
      console.info('❌ signaler closed:', e.reason || e.code);
      clearInterval(this.ping);
      const timeout = +e.reason || 3000;
      if (timeout === Infinity) return;

      clearTimeout(this.reconnect);
      if (this.reconnectCount > 0) {
        // @ts-ignore
        this.reconnect = setTimeout(() => {
          this.reconnectCount--;
          this.dispatchEvent(this.customEvents.tryConnect);
          this.setupWebsocket();
        }, timeout);
      }
      this.dispatchEvent(this.customEvents.disconnected);
    };
  }
  setupAttributes() {
    this.poster = this.getAttribute('poster') || '';
    console.log(this.poster);
    this.reconnectCount = +(this.getAttribute('reconnectCount') || Number.MAX_SAFE_INTEGER);
  }
  connectedCallback() {
    this.setupAttributes();
    this.setupWebsocket();
  }

  disconnectedCallback() {
    // WebRTC的生命周期与<video>的生命周期绑定
    this.ws.close(1000, 'Infinity');
    this.pc.close();
    console.log('❌ peer connection closing');
    // this.dc.close();
  }

  adoptedCallback() {}

  static observedAttributes = ['signal', 'ip', 'port', 'token'];
  // attributeChangedCallback(name, oldValue, newValue) {
  attributeChangedCallback() {
    if (!this.isConnected) return;
    // fired before connectedCallback when startup  一开始会触发：oldValue从null变成newValue
    this.ws.close(1000, '1');
  }

  async onWebSocketMessage(msgStr: string) {
    let msg;
    try {
      msg = JSON.parse(msgStr);
    } catch {
      console.debug('signaler:', msg);
      return;
    }

    if (msg.type === 'answer') {
      const answer = new RTCSessionDescription(msg);
      await this.pc.setRemoteDescription(answer);
      console.log('Got answer:', answer);
      // 功能不可用
      for (const receiver of this.pc.getReceivers()) {
        (receiver as any).playoutDelayHint = 0;
      }
    } else if (msg.type === 'iceCandidate') {
      const candidate = new RTCIceCandidate(msg.candidate);
      await this.pc.addIceCandidate(candidate);
      console.log('Got candidate:', candidate);
    } else if (msg.type === 'ping') {
      console.log('↓↓ ping:', msg);
      msg.type = 'pong';
      this.ws.send(JSON.stringify(msg));
    } else {
      console.warn('signaler:', msg);
    }
  }

  onDataChannelMessage(message: ArrayBuffer) {
    let data = new Uint8Array(message);
    const utf16 = new TextDecoder('utf-16');
    switch (data[0]) {
      case RECEIVE.VideoEncoderAvgQP: {
        this.VideoEncoderQP = +utf16.decode(data.slice(1));
        // console.debug("Got QP:", this.VideoEncoderQP);
        break;
      }
      case RECEIVE.Response: {
        // user custom message
        const detail = utf16.decode(data.slice(1));
        this.dispatchEvent(new CustomEvent('message', { detail }));
        console.info('Got ✉:', detail);
        break;
      }
      case RECEIVE.Command: {
        const command = JSON.parse(utf16.decode(data.slice(1)));
        console.info('Got command:', command);
        if (command.command === 'onScreenKeyboard') {
          console.info('You should setup a on-screen keyboard');
        }
        break;
      }
      case RECEIVE.FreezeFrame: {
        const size = new DataView(data.slice(1, 5).buffer).getInt32(0, true);
        const jpeg = data.slice(1 + 4);
        console.info('Got freezed frame:', jpeg);
        break;
      }
      case RECEIVE.UnfreezeFrame: {
        console.info('Got 【unfreeze frame】');
        break;
      }
      case RECEIVE.LatencyTest: {
        const latencyTimings = JSON.parse(utf16.decode(data.slice(1)));
        console.info('Got latency timings:', latencyTimings);
        break;
      }
      case RECEIVE.QualityControlOwnership: {
        this.QualityControlOwnership = data[1] !== 0;
        console.info('Got Quality Control Ownership:', this.QualityControlOwnership);
        break;
      }
      case RECEIVE.InitialSettings: {
        this.InitialSettings = JSON.parse(utf16.decode(data.slice(1)));
        console.log('Got initial setting:', this.InitialSettings);
        break;
      }
      default: {
        console.error('Got invalid data:', data);
      }
    }
  }

  setupVideo() {
    this.tabIndex = -1; // easy to focus..
    this.autofocus = true;
    this.playsInline = true;
    this.disablepictureinpicture = true;

    // Recently many browsers can only autoplay the videos with sound off
    this.muted = true;
    this.autoplay = true;

    // this.onsuspend
    // this.onresize
    // this.requestPointerLock();

    this.style.pointerEvents = 'none';
    this.style.objectFit = 'fill';
  }

  setupDataChannel(label = 'hello') {
    // See https://www.w3.org/TR/webrtc/#dom-rtcdatachannelinit for values (this is needed for Firefox to be consistent with Chrome.)
    this.dc = this.pc.createDataChannel(label, { ordered: true });
    // Inform browser we would like binary data as an ArrayBuffer (FF chooses Blob by default!)
    this.dc.binaryType = 'arraybuffer';
    this.dc.safeSend = (...params: any[]) => {
      try {
        if (this.dc.readyState === 'open') {
          this.dc.send(...params);
        }
      } catch (error) {
        console.log(error);
      }
    };

    this.dc.onopen = () => {
      this.dispatchEvent(this.customEvents.connected);
      console.log('✅ data channel connected:', label);
      this.style.pointerEvents = 'auto';
      this.dc.send(new Uint8Array([SEND.RequestInitialSettings]));
      this.dc.send(new Uint8Array([SEND.RequestQualityControl]));
    };

    this.dc.onclose = () => {
      console.info('❌ data channel closed:', label);
      // this.style.pointerEvents = "none";
    };

    this.dc.onmessage = (e: { data: ArrayBuffer }) => {
      this.onDataChannelMessage(e.data);
    };
  }

  setupPeerConnection() {
    console.log('setupPeerConnection');
    this.pc.close();
    this.pc = new RTCPeerConnection({
      // sdpSemantics: "unified-plan",
      iceServers: [
        // {
        //   urls: [
        //     "stun:stun.l.google.com:19302",
        //     "stun:stun1.l.google.com:19302",
        //     "stun:stun2.l.google.com:19302",
        //     "stun:stun3.l.google.com:19302",
        //     "stun:stun4.l.google.com:19302",
        //   ],
        // },
      ],
    });

    this.pc.ontrack = (e) => {
      console.log(`Got ${e.track.kind} track:`, e);
      if (e.track.kind === 'video') {
        this.srcObject = e.streams[0];
      } else if (e.track.kind === 'audio') {
        this.audio = document.createElement('audio');
        this.audio.autoplay = true;
        this.audio.srcObject = e.streams[0];
      }
    };
    this.pc.onicecandidate = (e) => {
      // firefox
      if (e.candidate?.candidate) {
        console.log('sending candidate:', e.candidate);
        this.ws.send(JSON.stringify({ type: 'iceCandidate', candidate: e.candidate }));
      } else {
        // Notice that the end of negotiation is detected here when the event"s candidate property is null.
      }
    };
    this.pc.onnegotiationneeded = (e) => {
      this.setupOffer();
    };
    const setPoster = () =>
      (this.poster =
        this.poster ||
        `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg"><style>text{font-size:7mm;fill:red;}</style>
        <text x="10" y="030"> Signal:      ${this.pc.signalingState}     </text>
        <text x="10" y="065"> Connect:     ${this.pc.connectionState}    </text>
        <text x="10" y="100"> ICE Gather:  ${this.pc.iceGatheringState}  </text>
        <text x="10" y="135"> ICE Connect: ${this.pc.iceConnectionState} </text>
      </svg>`);
    this.pc.onsignalingstatechange =
      this.pc.onconnectionstatechange =
      this.pc.oniceconnectionstatechange =
      this.pc.onicegatheringstatechange =
        setPoster;
  }

  async setupOffer() {
    // this.pc.addTransceiver("video", { direction: "recvonly" });

    const offer = await this.pc.createOffer({
      offerToReceiveAudio: this.hasAttribute('audio'),
      offerToReceiveVideo: true,
      // voiceActivityDetection: false,
    });

    // this indicate we support stereo (Chrome needs this)
    offer.sdp = offer.sdp?.replace(
      'useinbandfec=1',
      'useinbandfec=1;stereo=1;sprop-maxcapturerate=48000',
    );

    this.pc.setLocalDescription(offer);

    this.ws.send(JSON.stringify(offer));
    console.log('sending offer:', offer);
  }

  registerKeyboardEvents() {
    this.addEventListener('keydown', (event) => {
      // Handle the keydown event here
      console.log('Key pressed:', event.key);
    });
    this.onkeydown = (e) => {
      console.log(e.code, e.keyCode);
      this.dc.safeSend(
        new Uint8Array([
          SEND.KeyDown,
          SpecialKeyCodes[e.code as KeyCode] || e.keyCode,
          Number(e.repeat),
        ]),
      );
      // whether to prevent browser"s default behavior when keyboard/mouse have inputs, like F1~F12 and Tab
      e.preventDefault();
      //  e.stopPropagation
    };

    this.onkeyup = (e) => {
      this.dc.safeSend(
        new Uint8Array([SEND.KeyUp, SpecialKeyCodes[e.code as KeyCode] || e.keyCode]),
      );
      e.preventDefault();
    };

    this.onkeypress = (e) => {
      const data = new DataView(new ArrayBuffer(3));
      data.setUint8(0, SEND.KeyPress);
      data.setUint16(1, SpecialKeyCodes[e.code as KeyCode] || e.keyCode, true);
      this.dc.safeSend(data);
      e.preventDefault();
    };
  }

  registerTouchEvents() {
    // We need to assign a unique identifier to each finger.
    // We do this by mapping each Touch object to the identifier.
    const fingers = [9, 8, 7, 6, 5, 4, 3, 2, 1, 0];
    const fingerIds = {} as any;

    this.ontouchstart = (e) => {
      // Assign a unique identifier to each touch.
      for (const touch of Array.from(e.changedTouches)) {
        // remember touch
        const finger = fingers.pop();
        if (finger === undefined) {
          console.info('exhausted touch indentifiers');
        }
        fingerIds[touch.identifier] = finger;
      }
      this.emitTouchData(SEND.TouchStart, e.changedTouches, fingerIds);
      e.preventDefault();
    };

    this.ontouchend = (e) => {
      this.emitTouchData(SEND.TouchEnd, e.changedTouches, fingerIds);
      // Re-cycle unique identifiers previously assigned to each touch.
      for (const touch of Array.from(e.changedTouches)) {
        // forget touch
        fingers.push(fingerIds[touch.identifier]);
        delete fingerIds[touch.identifier];
      }
      e.preventDefault();
    };

    this.ontouchmove = (e) => {
      this.emitTouchData(SEND.TouchMove, e.touches, fingerIds);
      e.preventDefault();
    };
  }

  // 触屏模拟鼠标
  registerFakeMouseEvents() {
    let finger: { x: any; y: any; id: any } | undefined = undefined;

    const { left, top } = this.getBoundingClientRect();

    this.ontouchstart = (e) => {
      if (finger === undefined) {
        const firstTouch = e.changedTouches[0];
        finger = {
          id: firstTouch.identifier,
          x: firstTouch.clientX - left,
          y: firstTouch.clientY - top,
        };
        // Hack: Mouse events require an enter and leave so we just enter and leave manually with each touch as this event is not fired with a touch device.
        this.onmouseenter && this.onmouseenter!(e as any);
        this.emitMouseDown(MouseButton.MainButton, finger.x, finger.y);
      }
      e.preventDefault();
    };

    this.ontouchend = (e) => {
      for (const touch of Array.from(e.changedTouches)) {
        if (touch.identifier === finger?.id) {
          const x = touch.clientX - left;
          const y = touch.clientY - top;
          this.emitMouseUp(MouseButton.MainButton, x, y);
          // Hack: Manual mouse leave event.
          this.onmouseleave && this.onmouseleave(e as any);
          finger = undefined;
          break;
        }
      }
      e.preventDefault();
    };

    this.ontouchmove = (e) => {
      for (const touch of Array.from(e.changedTouches)) {
        if (touch.identifier === finger?.id) {
          const x = touch.clientX - left;
          const y = touch.clientY - top;
          this.emitMouseMove(x, y, x - finger.x, y - finger.y);
          finger.x = x;
          finger.y = y;
          break;
        }
      }
      e.preventDefault();
    };
  }

  registerMouseHoverEvents() {
    this.registerMouseEnterAndLeaveEvents();

    this.onmousemove = (e) => {
      this.emitMouseMove(e.offsetX, e.offsetY, e.movementX, e.movementY);
      e.preventDefault();
    };

    this.onmousedown = (e) => {
      this.emitMouseDown(e.button, e.offsetX, e.offsetY);
      // e.preventDefault();
    };

    this.onmouseup = (e) => {
      this.emitMouseUp(e.button, e.offsetX, e.offsetY);
      // e.preventDefault();
    };

    // When the context menu is shown then it is safest to release the button which was pressed when the event happened. This will guarantee we will get at least one mouse up corresponding to a mouse down event. Otherwise the mouse can get stuck.
    // https://github.com/facebook/react/issues/5531
    this.oncontextmenu = (e) => {
      this.emitMouseUp(e.button, e.offsetX, e.offsetY);
      e.preventDefault();
    };

    this.onwheel = (e) => {
      // console.log(e,e.wheelDeltaY,e.deltaY)
      // 临时处理
      this.emitMouseWheel(-e.deltaY, e.offsetX, e.offsetY);
      e.preventDefault();
    };
  }

  registerPointerlockEvents() {
    this.registerMouseEnterAndLeaveEvents();

    console.info('mouse locked in, ESC to exit');

    const { clientWidth, clientHeight } = this;
    let x = clientWidth / 2;
    let y = clientHeight / 2;

    this.onmousemove = (e) => {
      x += e.movementX;
      y += e.movementY;
      x = (x + clientWidth) % clientWidth;
      y = (y + clientHeight) % clientHeight;

      this.emitMouseMove(x, y, e.movementX, e.movementY);
    };

    this.onmousedown = (e) => {
      this.emitMouseDown(e.button, x, y);
    };

    this.onmouseup = (e) => {
      this.emitMouseUp(e.button, x, y);
    };

    this.onwheel = (e) => {
      // 临时处理
      this.emitMouseWheel(-e.deltaY, x, y);
    };
  }

  registerMouseEnterAndLeaveEvents() {
    this.onmouseenter = (e) => {
      this.dc.safeSend(new Uint8Array([SEND.MouseEnter]));
    };

    this.onmouseleave = (e) => {
      this.dc.safeSend && this.dc.safeSend(new Uint8Array([SEND.MouseLeave]));
    };
  }

  emitMouseMove(x: number, y: number, deltaX: number, deltaY: number) {
    const coord = this._normalize(x, y);
    deltaX = (deltaX * 65536) / this.clientWidth;
    deltaY = (deltaY * 65536) / this.clientHeight;
    const data = new DataView(new ArrayBuffer(9));
    data.setUint8(0, SEND.MouseMove);
    data.setUint16(1, coord.x, true);
    data.setUint16(3, coord.y, true);
    data.setInt16(5, deltaX, true);
    data.setInt16(7, deltaY, true);
    this.dc.safeSend(data);
  }

  emitMouseDown(button: number, x: number, y: number) {
    const coord = this._normalize(x, y);
    const data = new DataView(new ArrayBuffer(6));
    data.setUint8(0, SEND.MouseDown);
    data.setUint8(1, button);
    data.setUint16(2, coord.x, true);
    data.setUint16(4, coord.y, true);
    this.dc.safeSend(data);
  }

  emitMouseUp(button: number, x: number, y: number) {
    const coord = this._normalize(x, y);
    const data = new DataView(new ArrayBuffer(6));
    data.setUint8(0, SEND.MouseUp);
    data.setUint8(1, button);
    data.setUint16(2, coord.x, true);
    data.setUint16(4, coord.y, true);
    this.dc.safeSend(data);
  }

  emitMouseWheel(delta: number, x: number, y: number) {
    const coord = this._normalize(x, y);
    const data = new DataView(new ArrayBuffer(7));
    data.setUint8(0, SEND.MouseWheel);
    data.setInt16(1, delta, true);
    data.setUint16(3, coord.x, true);
    data.setUint16(5, coord.y, true);
    this.dc.safeSend(data);
  }

  emitTouchData(
    type: number,
    touches: string | any[] | TouchList,
    fingerIds: { [x: string]: number },
  ) {
    const data = new DataView(new ArrayBuffer(2 + 6 * touches.length));
    data.setUint8(0, type);
    data.setUint8(1, touches.length);
    let byte = 2;
    for (const touch of Array.from(touches)) {
      const x = touch.clientX - this.offsetLeft;
      const y = touch.clientY - this.offsetTop;

      const coord = this._normalize(x, y);
      data.setUint16(byte, coord.x, true);
      byte += 2;
      data.setUint16(byte, coord.y, true);
      byte += 2;
      data.setUint8(byte, fingerIds[touch.identifier]);
      byte += 1;
      data.setUint8(byte, 255 * touch.force); // force is between 0.0 and 1.0 so quantize into byte.
      byte += 1;
    }
    this.dc.safeSend(data);
  }

  // emit string
  emitMessage(msg: string | any[], messageType = SEND.UIInteraction) {
    if (typeof msg !== 'string') msg = JSON.stringify(msg);

    // Add the UTF-16 JSON string to the array byte buffer, going two bytes at a time.
    const data = new DataView(new ArrayBuffer(1 + 2 + 2 * msg.length));
    let byteIdx = 0;
    data.setUint8(byteIdx, messageType);
    byteIdx++;
    data.setUint16(byteIdx, msg.length, true);
    byteIdx += 2;
    for (const char of msg) {
      // charCodeAt() is UTF-16, codePointAt() is Unicode.
      data.setUint16(byteIdx, char.charCodeAt(0), true);
      byteIdx += 2;
    }
    this.dc.safeSend(data);
    // 有时候前端问：怎么返回undefined？是不是没发送成功？
    return true;
  }

  _normalize(x: number, y: number) {
    const normalizedX = x / this.clientWidth;
    const normalizedY = y / this.clientHeight;
    if (normalizedX < 0.0 || normalizedX > 1.0 || normalizedY < 0.0 || normalizedY > 1.0) {
      return {
        inRange: false,
        x: 65535,
        y: 65535,
      };
    } else {
      return {
        inRange: true,
        x: normalizedX * 65536,
        y: normalizedY * 65536,
      };
    }
  }

  debug(NodeJS: any) {
    // 调试信令服务器
    this.ws.send(JSON.stringify({ type: 'debug', debug: NodeJS }));
  }
}
type InitialSettings = {
  // onInitialize: () => void
} & CreatePeerStreamOptions;
export function initialize(initialSettings: InitialSettings) {
  customElements.define('peer-stream', PeerStream, { extends: 'video' });
}
