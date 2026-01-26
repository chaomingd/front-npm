import React from 'react';
import { KaTeXRenderer} from '@chaomingd/design';

const ExampleUsage: React.FC = () => {
  return (
    <div>
      <h2>公式展示：</h2>
      <KaTeXRenderer expression={String.raw`R_{敌人}=\sum{\frac{d_{enemy}}{distance_{engagement}}}-\lambda*remaining_{enemy}`} displayMode={true} />
    </div>
  );
};

export default ExampleUsage;
