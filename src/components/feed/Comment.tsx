import { ApolloCache, FetchResult, useMutation } from '@apollo/client';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import gql from 'graphql-tag';
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import {
  deleteComment,
  deleteCommentVariables,
} from '../../__generated__/deleteComment';
import { FatText } from '../shared';

const DELETE_COMMENT_MUTATION = gql`
  mutation deleteComment($id: Int!) {
    deleteComment(id: $id) {
      ok
    }
  }
`;

const CommentContainer = styled.div`
  margin-bottom: 8px;
`;

const CommentPayload = styled.span`
  margin-left: 10px;
  a {
    background-color: inherit;
    color: ${(props) => props.theme.accent};
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
`;

const Button = styled.button`
  background-color: inherit;
  color: ${(props) => props.theme.fontColor};
  border: none;
  cursor: pointer;
`;

interface ICommentProps {
  id?: string;
  photoId?: string;
  author: string;
  payload: string;
  isMine?: boolean;
}

const Comment: React.FC<ICommentProps> = ({
  id,
  photoId,
  author,
  payload,
  isMine,
}) => {
  const updateDeleteComment = (
    cache: ApolloCache<deleteComment>,
    result: FetchResult<deleteComment, Record<string, any>, Record<string, any>>
  ) => {
    const ok = result.data?.deleteComment.ok;
    if (ok) {
      cache.evict({ id: `Comment:${id}` });
      cache.modify({
        id: `Photo:${photoId}`,
        fields: {
          commentNumber: (prev) => {
            return prev - 1;
          },
        },
      });
    }
  };
  const [deleteComment] = useMutation<deleteComment, deleteCommentVariables>(
    DELETE_COMMENT_MUTATION,
    {
      update: updateDeleteComment,
    }
  );
  const onDeleteClick = () => {
    deleteComment({
      variables: {
        id: +id!,
      },
    });
  };
  return (
    <CommentContainer>
      <Link to={`/users/${author}`}>
        <FatText>{author}</FatText>
      </Link>
      <CommentPayload>
        {payload.split(/[ ]/).map((word, index) =>
          /#[\w]+/.test(word) ? (
            <React.Fragment key={index}>
              <Link to={`/hashtags/${word}`}>{word}</Link>{' '}
            </React.Fragment>
          ) : (
            <React.Fragment key={index}>{word} </React.Fragment>
          )
        )}
      </CommentPayload>
      {isMine ? (
        <Button onClick={onDeleteClick}>
          <FontAwesomeIcon icon={faTrashAlt} />
        </Button>
      ) : null}
    </CommentContainer>
  );
};

export default Comment;
