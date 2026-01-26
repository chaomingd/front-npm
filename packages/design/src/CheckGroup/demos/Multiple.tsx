// 编写一个 CheckGroup 的单选示例
import { Button, Form, Space } from 'antd';
import CheckGroup from '../index';

export default function App() {
  return (
    <Form onValuesChange={(v) => console.log(v)}>
      <Form.Item name="test" label="fff">
        <CheckGroup multiple>
          <Space>
            <CheckGroup.CheckItem value="1">
              {({ checked, onChange }) => (
                <Button type={checked ? 'primary' : 'default'} onClick={() => onChange()}>
                  1
                </Button>
              )}
            </CheckGroup.CheckItem>
            <CheckGroup.CheckItem value="2">
              {({ checked, onChange }) => (
                <Button type={checked ? 'primary' : 'default'} onClick={() => onChange()}>
                  2
                </Button>
              )}
            </CheckGroup.CheckItem>
            <CheckGroup.CheckItem value="3">
              {({ checked, onChange }) => (
                <Button type={checked ? 'primary' : 'default'} onClick={() => onChange()}>
                  3
                </Button>
              )}
            </CheckGroup.CheckItem>
          </Space>
        </CheckGroup>
      </Form.Item>
    </Form>
  );
}
