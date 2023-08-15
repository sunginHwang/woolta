import { FC } from "react";
import { Post } from ".";
import styled from "@emotion/styled";
import { colors } from "apps/blog/style/colors";
import layouts from "apps/blog/style/layouts";
import Link from "next/link";

interface Props {
  post: Post;
}

const Item: FC<Props> = ({ post }) => {
  return (
    <SC.Container>
      <Link href={`/categories/${post.categoryNo}/posts/${post.postNo}`}>
      <SC.Title>{post.title}</SC.Title>
      <SC.Content>{post.subDescription}</SC.Content>
      <SC.SubInfo>
        <span className="label">{post.categoryLabel}</span>
        <span className="Separator">|</span>
        <span className="meta">{post.author}</span>
        <span className="Separator">|</span>
        <span className="meta">{post.createdAt}</span>
      </SC.SubInfo>
      </Link>
    </SC.Container>
  );
};

export default Item;


const SC = {
  Container: styled.article`
  text-align: left;
  padding-bottom: 1.6rem;
  padding-top: 2.72rem;
  border-bottom: .2rem solid ${colors.gray500};

  @media screen and (max-width: ${layouts.phoneWidth}){
    padding-bottom: 0.8rem;
    padding-top: 1.92rem;
  }
  `,
  Title: styled.h2`
    color: ${colors.gray900};
    font-size: 2.88rem;
    font-weight: 700;
    margin-bottom: 1rem;
    cursor: pointer;

    @media screen and (max-width: ${layouts.phoneWidth}){
      font-size: 2.4rem;
    }
  `,
  Content: styled.div`
    margin-bottom: 1rem;
    cursor: pointer;
    font-size: 1.76rem;
    color: ${colors.gray600};
    max-width: 80%;
    line-height: 2.64rem;

    @media screen and (max-width: ${layouts.phoneWidth}){
      font-size: 1.28rem;
      max-width: 100%;
    }
  `,
  SubInfo: styled.div`
    .separator {
      font-size: 1.28rem;
      color: ${colors.gray300};
      margin-right: .5rem;

      @media screen and (max-width: ${layouts.phoneWidth}){
        font-size: 1rem;
      }
    }

    .meta {
      color: ${colors.gray_secondary};
      font-size: 1.28rem;
      margin-right: .5rem;

      @media screen and (max-width: ${layouts.phoneWidth}){
        font-size: 1rem;
      }
    }

    .label {
       margin-right: 1rem;
       color: ${colors.gray900};
        font-size: 1.28rem;

      @media screen and (max-width: ${layouts.phoneWidth}){
        font-size: 1rem;
      }
    }
  `,
}
