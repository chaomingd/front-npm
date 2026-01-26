"use strict";(self.webpackChunk_chaomingd_docs=self.webpackChunk_chaomingd_docs||[]).push([[5424],{19132:function(V,f,e){e.d(f,{Z:function(){return R}});var C=e(48305),x=e.n(C),A=e(82187),j=e.n(A),d=e(23828),c=e(75271),o={bannerContainer:"cP_NOQkvO8YnWdCS0lEW",bgImg:"ZKi2xffRF4ntK42ob_Zt",wrap:"PigWtfNf6MXoS0eSilDt",titleImg:"oohdX4DAZV4uVxGRviyU",slogan:"mEszZrkjhtETn7h5Nfrq",btn:"XFXAHIiuFx4Lhme2bUOM",link:"WqGSRHAFU0YRt7lf0pBR"},n=e(52676),v=function(){var r=(0,d.YB)();return(0,n.jsxs)("div",{className:o.bannerContainer,children:[(0,n.jsx)("img",{draggable:!1,className:o.bgImg,src:"https://mdn.alipayobjects.com/huamei_mutawc/afts/img/A*664qTJ8PpR8AAAAAAAAAAAAADlrGAQ/original",alt:"banner"}),(0,n.jsxs)("div",{className:o.wrap,children:[(0,n.jsx)("img",{draggable:!1,className:o.titleImg,src:"/title.png",alt:"title"}),(0,n.jsx)("div",{className:o.slogan,children:r.formatMessage({id:"app.docs.site.index.banner.slogan"})}),(0,n.jsx)("div",{className:o.btn,children:(0,n.jsx)(d.rU,{to:"/guide/ant-design-laf".concat(r.locale==="zh-CN"?"-cn":""),children:r.formatMessage({id:"app.docs.site.index.banner.button-text"})})})]})]})},S=null,u={container:"rYApiFtLiMMiCIkxmdL7",item:"rrDOWSr5z4EgK7QwSiIR",title:"Y2X4AptwxJ8tRtaBu7xK",desc:"c4JjpN44GcHgAPuJ8xDv",preview:"wC_4IhRKgCYceyJMCyMH"},b=function(){var r=(0,d.YB)(),p=[{preview:"https://mdn.alipayobjects.com/huamei_mutawc/afts/img/A*BGOrT7hmCK0AAAAAAAAAAAAADlrGAQ/original",title:r.formatMessage({id:"app.docs.site.features.0.title"}),description:r.formatMessage({id:"app.docs.site.features.0.description"})},{preview:"https://mdn.alipayobjects.com/huamei_mutawc/afts/img/A*lg4mQrmwvQMAAAAAAAAAAAAADlrGAQ/original",title:r.formatMessage({id:"app.docs.site.features.1.title"}),description:r.formatMessage({id:"app.docs.site.features.1.description"})},{preview:"https://mdn.alipayobjects.com/huamei_mutawc/afts/img/A*QIPWQJicUxYAAAAAAAAAAAAADlrGAQ/original",title:r.formatMessage({id:"app.docs.site.features.2.title"}),description:r.formatMessage({id:"app.docs.site.features.2.description"})}];return(0,n.jsx)("div",{className:u.container,children:p.map(function(a){return(0,n.jsxs)("div",{className:u.item,children:[(0,n.jsx)("div",{className:u.title,children:a.title}),(0,n.jsx)("div",{className:u.desc,children:a.description}),(0,n.jsx)("img",{className:u.preview,src:a.preview,alt:a.title})]},a.title)})})},O=null,z={container:"ND1co2OqXwcZv3ummEN9"},I=function(){var r=(0,d.OI)(),p=x()(r,2),a=p[0],i=p[1];return(0,c.useEffect)(function(){i==="auto"&&document.documentElement.setAttribute("data-prefers-color",window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light")},[i]),(0,n.jsxs)("div",{className:j()(z.container,{dark:a==="dark"}),children:[(0,n.jsx)(v,{}),(0,n.jsx)(b,{})]})},R=I},57956:function(V,f,e){var C=e(26068),x=e(48305),A=e(53649),j=e(75271),d=e(23828),c=e(66292),o=e(39165),n=e(82092),v=e(58226),S=e(82187),u=e(52676),b=function(t){var s=t.name,y=t.isNew,N=t.justCopied,B=t.onCopied,m=t.theme;console.log("theme",m);var k=classNames(_defineProperty({copied:N===s},m,!!m)),P=function(Z,F){F?B(s,Z):message.error("Copy icon name failed, please try again.")};return _jsx(CopyToClipboard,{text:"<".concat(s," />"),onCopy:P,children:_jsx("li",{className:k,children:_jsx("span",{className:"anticon-class",children:_jsx(Badge,{dot:y,children:s})})})})},O=null,z=e(67825),I=e(1801),R=null,M=I.Z.useToken,r=function(){var t=M(),s=t.token,y=_objectWithoutProperties(t,R),N=useContext(ConfigProvider.ConfigContext),B=N.getPrefixCls,m=N.iconPrefixCls,k=B(),P=s.colorFillTertiary;return _objectSpread(_objectSpread({},y),{},{token:_objectSpread(_objectSpread({},s),{},{headerHeight:64,menuItemBorder:2,mobileMaxWidth:767.99,siteMarkdownCodeBg:P,antCls:".".concat(k),iconCls:".".concat(m),marginFarXS:s.marginXXL/6*7,marginFarSM:s.marginXXL/3*5,marginFar:s.marginXXL*2,codeFamily:"'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace"})})},p=null,a,i=function(){var l=useSiteToken(),t=l.token,s=t.antCls,y=t.iconCls;return _jsx(Global,{styles:css(a||(a=_taggedTemplateLiteral([`
        ul.anticons-list {
          margin: 10px 0;
          overflow: hidden;
          direction: ltr;
          list-style: none;

          li {
            position: relative;
            float: left;
            width: 16.66%;
            height: 100px;
            margin: 3px 0;
            padding: 10px 0 0;
            overflow: hidden;
            color: #555;
            text-align: center;
            list-style: none;
            background-color: inherit;
            border-radius: 4px;
            cursor: pointer;
            transition:
              color 0.3s ease-in-out,
              background-color 0.3s ease-in-out;

            .rtl & {
              margin: 3px 0;
              padding: 10px 0 0;
            }

            `,` {
              margin: 12px 0 8px;
              font-size: 36px;
              transition: transform 0.3s ease-in-out;
              will-change: transform;
            }

            .anticon-class {
              display: block;
              font-family: 'Lucida Console', Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono',
                monospace;
              white-space: nowrap;
              text-align: center;
              transform: scale(0.83);

              `,`-badge {
                transition: color 0.3s ease-in-out;
              }
            }

            &:hover {
              color: #fff;
              background-color: `,`;

              `,` {
                transform: scale(1.4);
              }

              `,`-badge {
                color: #fff;
              }
            }

            &.TwoTone:hover {
              background-color: #8ecafe;
            }

            &.copied:hover {
              color: rgba(255, 255, 255, 0.2);
            }

            &::after {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              color: #fff;
              line-height: 110px;
              text-align: center;
              background: #006aff;
              opacity: 0;
              transition: all 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28);
              content: 'Copied!';
            }

            &.copied::after {
              opacity: 1;
            }
          }
        }

        .copied-code {
          padding: 2px 4px;
          font-size: 12px;
          background: #f5f5f5;
          border-radius: 2px;
        }
      `])),y,s,t.colorPrimary,y,s)})},g=function(t){var s=t.icons,y=t.title,N=t.newIcons,B=t.theme,m=useIntl(),k=React.useState(null),P=_slicedToArray(k,2),J=P[0],Z=P[1],F=React.useRef(null),ee=React.useCallback(function(w,oe){message.success(_jsxs("span",{children:[_jsx("code",{className:"copied-code",children:oe})," copied \u{1F389}"]})),Z(w),F.current=setTimeout(function(){Z(null)},2e3)},[]);return React.useEffect(function(){return function(){F.current&&clearTimeout(F.current)}},[]),_jsxs("div",{children:[_jsx("h3",{children:m.formatMessage({id:"app.docs.components.icon.category.".concat(y)})}),_jsx(IconStyle,{}),_jsx("ul",{className:"anticons-list",children:s.map(function(w){return _jsx(CopyableIcon,{name:w,theme:B,isNew:N.includes(w),justCopied:J,onCopied:ee},w)})})]})},W=null,G=[],T=["StepBackward","StepForward","FastBackward","FastForward","Shrink","ArrowsAlt","Down","Up","Left","Right","CaretUp","CaretDown","CaretLeft","CaretRight","UpCircle","DownCircle","LeftCircle","RightCircle","DoubleRight","DoubleLeft","VerticalLeft","VerticalRight","VerticalAlignTop","VerticalAlignMiddle","VerticalAlignBottom","Forward","Backward","Rollback","Enter","Retweet","Swap","SwapLeft","SwapRight","ArrowUp","ArrowDown","ArrowLeft","ArrowRight","PlayCircle","UpSquare","DownSquare","LeftSquare","RightSquare","Login","Logout","MenuFold","MenuUnfold","BorderBottom","BorderHorizontal","BorderInner","BorderOuter","BorderLeft","BorderRight","BorderTop","BorderVerticle","PicCenter","PicLeft","PicRight","RadiusBottomleft","RadiusBottomright","RadiusUpleft","RadiusUpright","Fullscreen","FullscreenExit"],E=["Question","QuestionCircle","Plus","PlusCircle","Pause","PauseCircle","Minus","MinusCircle","PlusSquare","MinusSquare","Info","InfoCircle","Exclamation","ExclamationCircle","Close","CloseCircle","CloseSquare","Check","CheckCircle","CheckSquare","ClockCircle","Warning","IssuesClose","Stop"],U=["Edit","Form","Copy","Scissor","Delete","Snippets","Diff","Highlight","AlignCenter","AlignLeft","AlignRight","BgColors","Bold","Italic","Underline","Strikethrough","Redo","Undo","ZoomIn","ZoomOut","FontColors","FontSize","LineHeight","Dash","SmallDash","SortAscending","SortDescending","Drag","OrderedList","UnorderedList","RadiusSetting","ColumnWidth","ColumnHeight"],X=["AreaChart","PieChart","BarChart","DotChart","LineChart","RadarChart","HeatMap","Fall","Rise","Stock","BoxPlot","Fund","Sliders"],Q=["Android","Apple","Windows","Ie","Chrome","Github","Aliwangwang","Dingding","WeiboSquare","WeiboCircle","TaobaoCircle","Html5","Weibo","Twitter","Wechat","Youtube","AlipayCircle","Taobao","Skype","Qq","MediumWorkmark","Gitlab","Medium","Linkedin","GooglePlus","Dropbox","Facebook","Codepen","CodeSandbox","CodeSandboxCircle","Amazon","Google","CodepenCircle","Alipay","AntCloud","Aliyun","Zhihu","Slack","SlackSquare","Behance","BehanceSquare","Dribbble","DribbbleSquare","Instagram","Yuque","Alibaba","Yahoo","Reddit","Sketch"],$=[].concat(T,E,U,X,Q),_=G.filter(function(l){return!$.includes(l)}),le={direction:T,suggestion:E,editor:U,data:X,logo:Q,other:_},q=null,ae,Y=function(l){return l.Filled="Filled",l.Outlined="Outlined",l.TwoTone="TwoTone",l.Colored="Colored",l}({}),te={},ce=function(){return{iconSearchAffix:css(ae||(ae=_taggedTemplateLiteral([`
    display: flex;
    transition: all 0.3s;
    justify-content: space-between;
  `])))}},de=function(t){return[{value:Y.Outlined,label:t.formatMessage({id:"app.docs.components.icon.outlined"})},{value:Y.Filled,label:t.formatMessage({id:"app.docs.components.icon.filled"})},{value:Y.TwoTone,label:t.formatMessage({id:"app.docs.components.icon.two-tone"})}]},fe=function(){var t=useIntl(),s=ce(),y=s.iconSearchAffix,N=useState({searchKey:"",theme:Y.Outlined}),B=_slicedToArray(N,2),m=B[0],k=B[1],P=difference(Object.keys(te),Object.keys(AntdIcons)),J=debounce(function(H){k(function(K){return _objectSpread(_objectSpread({},K),{},{searchKey:H.target.value})})},300),Z=useCallback(function(H){k(function(K){return _objectSpread(_objectSpread({},K),{},{theme:H})})},[]),F=useMemo(function(){var H=m.searchKey,K=H===void 0?"":H,se=m.theme;console.log("categories",categories),console.log("ww",Object.keys(categories));var ie=Object.keys(categories).map(function(L){var h=categories[L];if(K){var ne=K.replace(new RegExp("^<([a-zA-Z]*)\\s/>$","gi"),function(D,he){return he}).replace(/(Filled|Outlined|TwoTone)$/,"").toLowerCase();h=h.filter(function(D){return D.toLowerCase().includes(ne)})}var pe=["CopyrightCircle","DollarCircle"];return h=h.filter(function(D){return!pe.includes(D)}),{category:L,icons:h.map(function(D){return D+se}).filter(function(D){return te[D]})}}).filter(function(L){var h=L.icons;return!!h.length}).map(function(L){var h=L.category,ne=L.icons;return _jsx(Category,{title:h,theme:se,icons:ne,newIcons:P},h)});return ie.length?ie:_jsx(Empty,{style:{margin:"2em 0"}})},[m.searchKey,m.theme]),ee=useState(!1),w=_slicedToArray(ee,2),oe=w[0],ue=w[1],me=useSiteToken(),re=me.token,ge=re.borderRadius,ve=re.colorBgContainer,xe={boxShadow:"rgba(50, 50, 93, 0.25) 0 6px 12px -2px, rgba(0, 0, 0, 0.3) 0 3px 7px -3px",padding:8,margin:-8,borderRadius:ge,backgroundColor:ve};return _jsxs("div",{className:"markdown",children:[_jsx(Affix,{offsetTop:24,onChange:ue,children:_jsxs("div",{style:{display:"flex"},children:[_jsx(Segmented,{size:"large",value:m.theme,options:de(t),onChange:Z}),_jsx(Input.Search,{placeholder:t.formatMessage({id:"app.docs.components.icon.search.placeholder"}),style:{flex:1,marginInlineStart:16},allowClear:!0,autoFocus:!0,size:"large",onChange:J})]})}),F]})},Ce=null},9175:function(V,f,e){e.d(f,{Z:function(){return r}});var C=e(53649),x=e.n(C),A=e(75271),j=e(90924),d=e(69318),c=e(91011),o=e(1880),n=e(52676),v=function(a){var i=a.className,g=a.style;return(0,n.jsx)("svg",{className:i,style:g,fill:"#E53E3E",focusable:"false",height:"1em",stroke:"#E53E3E",strokeWidth:"0",viewBox:"0 0 16 16",width:"1em",children:(0,n.jsx)("path",{d:"M0 0v16h16v-16h-16zM13 13h-2v-8h-3v8h-5v-10h10v10z"})})},S=v,u=function(a){var i=a.className,g=a.style;return(0,n.jsx)("svg",{className:i,style:g,"aria-hidden":"true",fill:"#F69220",focusable:"false",height:"1em",role:"img",stroke:"#F69220",strokeWidth:"0",viewBox:"0 0 24 24",width:"1em",children:(0,n.jsx)("path",{d:"M0 0v7.5h7.5V0zm8.25 0v7.5h7.498V0zm8.25 0v7.5H24V0zM8.25 8.25v7.5h7.498v-7.5zm8.25 0v7.5H24v-7.5zM0 16.5V24h7.5v-7.5zm8.25 0V24h7.498v-7.5zm8.25 0V24H24v-7.5z"})})},b=u,O=function(a){var i=a.className,g=a.style;return(0,n.jsx)("svg",{className:i,style:g,"aria-hidden":"true",fill:"#2C8EBB",focusable:"false",height:"1em",stroke:"#2C8EBB",strokeWidth:"0",viewBox:"0 0 496 512",width:"1em",children:(0,n.jsx)("path",{d:"M393.9 345.2c-39 9.3-48.4 32.1-104 47.4 0 0-2.7 4-10.4 5.8-13.4 3.3-63.9 6-68.5 6.1-12.4.1-19.9-3.2-22-8.2-6.4-15.3 9.2-22 9.2-22-8.1-5-9-9.9-9.8-8.1-2.4 5.8-3.6 20.1-10.1 26.5-8.8 8.9-25.5 5.9-35.3.8-10.8-5.7.8-19.2.8-19.2s-5.8 3.4-10.5-3.6c-6-9.3-17.1-37.3 11.5-62-1.3-10.1-4.6-53.7 40.6-85.6 0 0-20.6-22.8-12.9-43.3 5-13.4 7-13.3 8.6-13.9 5.7-2.2 11.3-4.6 15.4-9.1 20.6-22.2 46.8-18 46.8-18s12.4-37.8 23.9-30.4c3.5 2.3 16.3 30.6 16.3 30.6s13.6-7.9 15.1-5c8.2 16 9.2 46.5 5.6 65.1-6.1 30.6-21.4 47.1-27.6 57.5-1.4 2.4 16.5 10 27.8 41.3 10.4 28.6 1.1 52.7 2.8 55.3.8 1.4 13.7.8 36.4-13.2 12.8-7.9 28.1-16.9 45.4-17 16.7-.5 17.6 19.2 4.9 22.2zM496 256c0 136.9-111.1 248-248 248S0 392.9 0 256 111.1 8 248 8s248 111.1 248 248zm-79.3 75.2c-1.7-13.6-13.2-23-28-22.8-22 .3-40.5 11.7-52.8 19.2-4.8 3-8.9 5.2-12.4 6.8 3.1-44.5-22.5-73.1-28.7-79.4 7.8-11.3 18.4-27.8 23.4-53.2 4.3-21.7 3-55.5-6.9-74.5-1.6-3.1-7.4-11.2-21-7.4-9.7-20-13-22.1-15.6-23.8-1.1-.7-23.6-16.4-41.4 28-12.2.9-31.3 5.3-47.5 22.8-2 2.2-5.9 3.8-10.1 5.4h.1c-8.4 3-12.3 9.9-16.9 22.3-6.5 17.4.2 34.6 6.8 45.7-17.8 15.9-37 39.8-35.7 82.5-34 36-11.8 73-5.6 79.6-1.6 11.1 3.7 19.4 12 23.8 12.6 6.7 30.3 9.6 43.9 2.8 4.9 5.2 13.8 10.1 30 10.1 6.8 0 58-2.9 72.6-6.5 6.8-1.6 11.5-4.5 14.6-7.1 9.8-3.1 36.8-12.3 62.2-28.7 18-11.7 24.2-14.2 37.6-17.4 12.9-3.2 21-15.1 19.4-28.2z"})})},z=O,I,R=(0,c.kc)(function(){return{packageManager:(0,c.iv)(I||(I=x()([`
    display: flex;
    align-items: center;
    justify-content: center;
    svg {
      margin-inline-end: 8px;
    }
  `])))}}),M=function(a){var i=a.npm,g=a.yarn,W=a.pnpm,G=R(),T=G.styles,E=A.useMemo(function(){return[{key:"npm",children:i?(0,n.jsx)(o.Z,{lang:"bash",children:i}):null,label:(0,n.jsxs)("div",{className:T.packageManager,children:[(0,n.jsx)(S,{}),(0,n.jsx)("span",{children:"npm"})]})},{key:"yarn",children:g?(0,n.jsx)(o.Z,{lang:"bash",children:g}):null,label:(0,n.jsxs)("div",{className:T.packageManager,children:[(0,n.jsx)(z,{}),(0,n.jsx)("span",{children:"yarn"})]})},{key:"pnpm",children:W?(0,n.jsx)(o.Z,{lang:"bash",children:W}):null,label:(0,n.jsxs)("div",{className:T.packageManager,children:[(0,n.jsx)(b,{}),(0,n.jsx)("span",{children:"pnpm"})]})}].filter(function(U){return U.children})},[i,g,W]);return(0,n.jsx)(j.ZP,{theme:{components:{Tabs:{horizontalMargin:"0"}}},children:(0,n.jsx)(d.Z,{className:"markdown",size:"small",defaultActiveKey:"npm",items:E})})},r=M},61794:function(V,f,e){var C=e(9175),x=e(52676),A=function(c){var o=c.command,n="npm run ".concat(o),v="yarn ".concat(o),S="pnpm ".concat(o);return _jsx(InstallDependencies,{npm:n,yarn:v,pnpm:S})},j=null},49005:function(V,f,e){var C=e(9175),x=e(52676),A=function(d){var c=d.packageNames,o=d.save,n=!1;(o==="true"||o!=="false")&&(n=!0);var v=n?"".concat(o==="true"?"--save":"--save".concat(o==="dev"?"-dev":"-".concat(o))," "):"",S="npm install ".concat(c," ").concat(v),u="yarn add ".concat(c),b="pnpm add ".concat(c," ").concat(v);return(0,x.jsx)(C.Z,{npm:S,yarn:u,pnpm:b})};f.Z=A},95031:function(V,f,e){e.d(f,{Z:function(){return W}});var C=e(48305),x=e.n(C),A=e(37926),j=e(90924),d=e(91011),c=e(66567),o=e(7671),n=e(70797),v=e(36049),S=e(23828),u=e(75271),b=e(26068),O=e.n(b),z=e(81072),I={Address:["Basic Address","Copyable","Custom Tooltip","Format"]},R={"Basic Button":[{demo:z.ZP,tokens:[],key:"Basic Button"}]},M=O()({},I),r=O()({},R),p={container:"eS7VoBl2T8RK8Kiqbjds"},a=e(52676),i="ant-design-web3-custom-theme",g=function(){var T=A.ZP.useMessage(),E=x()(T,2),U=E[0],X=E[1],Q=u.useRef((0,c.NK)(JSON.parse(localStorage.getItem(i)||"{}"))),$=(0,S.bU)(),_=(0,d.Fg)();return(0,a.jsxs)(u.StrictMode,{children:[X,(0,a.jsx)("div",{className:p.container,style:{height:"calc(100vh - ".concat(_.headerHeight,"px)")},children:(0,a.jsx)(j.ZP,{locale:$.id==="zh-CN"?v.Z:n.default,theme:{hashed:!0},children:(0,a.jsx)(o.Z,{showTheme:!0,initialThemeConfig:Q.current,components:M,demos:r,onSave:function(q){localStorage.setItem(i,JSON.stringify((0,c.Vl)(q))),navigator.clipboard.writeText(JSON.stringify(q,null,2)),U.success("\u{1F389} \u4FDD\u5B58\u6210\u529F\uFF0C\u53EF\u7C98\u8D34\u5230\u9879\u76EE\u4E2D\u4F7F\u7528\uFF01")}})})})]})},W=g}}]);
