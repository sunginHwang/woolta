import { Content } from './content/Content';
import { Title } from './title/Title';
import styles from './Post.module.css';

export const Post = () => {
  return (
    <div className={styles.container}>
      <Title />
      <Content />
    </div>
  );
};
