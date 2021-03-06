import { RenderConfigScreenCtx } from 'datocms-plugin-sdk';
import { Canvas, ContextInspector } from 'datocms-react-ui';
import s from './styles.module.css';

type Props = {
  ctx: RenderConfigScreenCtx;
};

export default function ConfigScreen({ ctx }: Props) {
  return (
    <Canvas ctx={ctx}>
      <p>Welcome to the Workflow Tracker plugin</p>
      <div className={s.inspector}>
        {/*<ContextInspector ctx={ctx} />*/}
      </div>
    </Canvas>
  );
}
