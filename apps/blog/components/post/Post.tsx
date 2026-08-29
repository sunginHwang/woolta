import { Content } from './content/Content';
import styles from './Post.module.css';
import { Title } from './title/Title';

export const Post = () => {
  return (
    <div className={styles.container}>
      <Title />
      <Content />
    </div>
  );
};
