import { ApolloCache, FetchResult, gql, useMutation } from '@apollo/client';
import React from 'react';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import { useMe } from '../../hooks/useMe';
import {
  createComment,
  createCommentVariables,
} from '../../__generated__/createComment';
import { seeFeed_seeFeed_comments } from '../../__generated__/seeFeed';
import Comment from './Comment';

export const CREATE_COMMENT_MUTATION = gql`
  mutation createComment($photoId: Int!, $payload: String!) {
    createComment(photoId: $photoId, payload: $payload) {
      ok
      error
      id
    }
  }
`;

const CommentsContainer = styled.div`
  margin-top: 20px;
`;

const CommentCount = styled.span`
  opacity: 0.7;
  margin: 10px 0px;
  display: block;
  font-weight: 600;
  font-size: 10px;
`;

const PostCommentContainer = styled.div`
  margin-top: 10px;
  padding-top: 15px;
  padding-bottom: 10px;
  border-top: 1px solid ${(props) => props.theme.borderColor};
`;

const PostCommentInput = styled.input`
  width: 100%;
  &::placeholder {
    font-size: 12px;
  }
`;

interface ICommnetsProps {
  photoId: string;
  author: string;
  caption?: string;
  commentNumber: number;
  comments: (seeFeed_seeFeed_comments | null)[] | null;
}

interface ICreateCommentForm {
  payload: string;
}

const Comments: React.FC<ICommnetsProps> = ({
  photoId,
  author,
  caption,
  commentNumber,
  comments,
}) => {
  const { data: userData } = useMe();
  const updateCreateComment = (
    cache: ApolloCache<createComment>,
    result: FetchResult<createComment, Record<string, any>, Record<string, any>>
  ) => {
    const { payload } = getValues();
    setValue('payload', '');
    const ok = result.data?.createComment.ok;
    const id = result.data?.createComment.id;
    if (ok && userData) {
      const newComment = {
        __typename: 'Comment',
        createdAt: Date.now() + '',
        id,
        isMine: true,
        payload,
        user: {
          ...userData.me,
        },
      };
      const newCacheComment = cache.writeFragment({
        data: newComment,
        fragment: gql`
          fragment CommentFragment on Comment {
            id
            createdAt
            isMine
            payload
            user {
              username
              avatar
            }
          }
        `,
      });
      cache.modify({
        id: `Photo:${photoId}`,
        fields: {
          comments(prev) {
            return [...prev, newCacheComment];
          },
          commentNumber(prev) {
            return prev + 1;
          },
        },
      });
    }
  };
  const [createComment, { loading }] = useMutation<
    createComment,
    createCommentVariables
  >(CREATE_COMMENT_MUTATION, {
    update: updateCreateComment,
  });
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
  } = useForm<ICreateCommentForm>();
  const onSubmit = () => {
    if (loading) {
      return;
    }
    const { payload } = getValues();
    createComment({
      variables: {
        photoId: +photoId,
        payload,
      },
    });
  };
  return (
    <CommentsContainer>
      <Comment author={author} payload={caption || ''} />
      <CommentCount>
        {commentNumber === 1 ? '1 comment' : `${commentNumber} comments`}
      </CommentCount>
      {comments?.map((comment) => (
        <Comment
          key={comment?.id}
          id={comment?.id}
          photoId={photoId}
          author={comment?.user.username || ''}
          payload={comment?.payload || ''}
          isMine={comment?.isMine}
        />
      ))}
      <PostCommentContainer>
        <form onSubmit={handleSubmit(onSubmit)}>
          <PostCommentInput
            {...register('payload', { required: 'Payload is required.' })}
            type="text"
            placeholder="Write a comment..."
          />
        </form>
      </PostCommentContainer>
    </CommentsContainer>
  );
};

export default Comments;
