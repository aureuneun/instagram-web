import React from 'react';
import gql from 'graphql-tag';
import { useParams } from 'react-router';
import { PHOTO_FRAGMENT } from '../fragments';
import {
  ApolloCache,
  FetchResult,
  useApolloClient,
  useMutation,
  useQuery,
} from '@apollo/client';
import styled from 'styled-components';
import { FatText } from '../components/shared';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faHeart } from '@fortawesome/free-regular-svg-icons';
import { seeProfile, seeProfileVariables } from '../__generated__/seeProfile';
import PageTitle from '../components/PageTitle';
import Button from '../components/auth/Button';
import {
  unfollowUser,
  unfollowUserVariables,
} from '../__generated__/unfollowUser';
import { followUser, followUserVariables } from '../__generated__/followUser';
import { useMe } from '../hooks/useMe';

export const FOLLOW_USER_MUTATION = gql`
  mutation followUser($username: String!) {
    followUser(username: $username) {
      ok
    }
  }
`;

export const UNFOLLOW_USER_MUTATION = gql`
  mutation unfollowUser($username: String!) {
    unfollowUser(username: $username) {
      ok
    }
  }
`;

export const SEE_PROFILE_QUERY = gql`
  query seeProfile($username: String!, $page: Int!) {
    seeProfile(username: $username) {
      firstName
      lastName
      username
      bio
      avatar
      photos(page: $page) {
        ...PhotoFragment
      }
      totalFollowing
      totalFollowers
      isMe
      isFollowing
    }
  }
  ${PHOTO_FRAGMENT}
`;

const Header = styled.div`
  display: flex;
`;

const Avatar = styled.img`
  margin-left: 50px;
  height: 160px;
  width: 160px;
  border-radius: 50%;
  margin-right: 150px;
  background-color: #2c2c2c;
`;

const Column = styled.div``;

const Username = styled.h3`
  font-size: 28px;
  font-weight: 400;
`;

const Row = styled.div`
  margin-bottom: 20px;
  font-size: 16px;
  display: flex;
  align-items: center;
`;

const List = styled.ul`
  display: flex;
`;

const Item = styled.li`
  margin-right: 20px;
`;

const Value = styled(FatText)`
  font-size: 18px;
`;

const Name = styled(FatText)`
  font-size: 20px;
`;

const Grid = styled.div`
  display: grid;
  grid-auto-rows: 290px;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  margin-top: 50px;
`;

interface IPhotoProps {
  bg: string;
}

const Photo = styled.div<IPhotoProps>`
  background-image: url(${(props) => props.bg});
  background-size: cover;
  position: relative;
`;

const Icons = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  opacity: 0;
  &:hover {
    opacity: 1;
  }
`;

const Icon = styled.span`
  font-size: 18px;
  display: flex;
  align-items: center;
  margin: 0px 5px;
  svg {
    font-size: 14px;
    margin-right: 5px;
  }
`;

const ProfileBtn = styled(Button).attrs({
  as: 'span',
})`
  margin-left: 10px;
  margin-top: 0px;
`;

interface IParams {
  username: string;
}

interface ISeePropfileProps {
  isMe: boolean;
  isFollowing: boolean;
}

const Profile = () => {
  const { username } = useParams<IParams>();
  const { data: userData } = useMe();
  const client = useApolloClient();
  const { data } = useQuery<seeProfile, seeProfileVariables>(
    SEE_PROFILE_QUERY,
    {
      variables: {
        username,
        page: 1,
      },
    }
  );
  const updateUnfollowUser = (
    cache: ApolloCache<unfollowUser>,
    result: FetchResult<unfollowUser, Record<string, any>, Record<string, any>>
  ) => {
    const ok = result.data?.unfollowUser.ok;
    if (!ok) {
      return;
    }
    cache.modify({
      id: `User:${username}`,
      fields: {
        isFollowing: (prev) => {
          return false;
        },
        totalFollowers: (prev) => {
          return prev - 1;
        },
      },
    });
    cache.modify({
      id: `User:${userData?.me?.username}`,
      fields: {
        totalFollowing(prev) {
          return prev - 1;
        },
      },
    });
  };
  const [unfollowUser] = useMutation<unfollowUser, unfollowUserVariables>(
    UNFOLLOW_USER_MUTATION,
    {
      update: updateUnfollowUser,
    }
  );
  const completedFollowUser = (data: followUser) => {
    const {
      followUser: { ok },
    } = data;
    if (!ok) {
      return;
    }
    const { cache } = client;
    cache.modify({
      id: `User:${username}`,
      fields: {
        isFollowing(prev) {
          return true;
        },
        totalFollowers(prev) {
          return prev + 1;
        },
      },
    });
    cache.modify({
      id: `User:${userData?.me?.username}`,
      fields: {
        totalFollowing(prev) {
          return prev + 1;
        },
      },
    });
  };
  const [followUser] = useMutation<followUser, followUserVariables>(
    FOLLOW_USER_MUTATION,
    { onCompleted: completedFollowUser }
  );
  const getButton = (seeProfile: ISeePropfileProps) => {
    const { isMe, isFollowing } = seeProfile;
    if (isMe) {
      return <ProfileBtn>Edit Profile</ProfileBtn>;
    }
    if (isFollowing) {
      return (
        <ProfileBtn
          onClick={() =>
            unfollowUser({
              variables: {
                username,
              },
            })
          }
        >
          Unfollow
        </ProfileBtn>
      );
    } else {
      return (
        <ProfileBtn
          onClick={() =>
            followUser({
              variables: {
                username,
              },
            })
          }
        >
          Follow
        </ProfileBtn>
      );
    }
  };
  return (
    <div>
      <PageTitle title="Profile" />
      <Header>
        <Avatar src={data?.seeProfile?.avatar || ''} />
        <Column>
          <Row>
            <Username>{data?.seeProfile?.username}</Username>
            {data?.seeProfile ? getButton(data.seeProfile) : null}
          </Row>
          <Row>
            <List>
              <Item>
                <span>
                  <Value>{data?.seeProfile?.totalFollowers}</Value> followers
                </span>
              </Item>
              <Item>
                <span>
                  <Value>{data?.seeProfile?.totalFollowing}</Value> following
                </span>
              </Item>
            </List>
          </Row>
          <Row>
            <Name>
              {data?.seeProfile?.firstName}
              {'  '}
              {data?.seeProfile?.lastName}
            </Name>
          </Row>
          <Row>{data?.seeProfile?.bio}</Row>
        </Column>
      </Header>
      <Grid>
        {data?.seeProfile?.photos &&
          data.seeProfile.photos.length > 0 &&
          data.seeProfile.photos.map((photo) => (
            <Photo bg={photo?.file || ''} key={photo?.id}>
              <Icons>
                <Icon>
                  <FontAwesomeIcon icon={faHeart} />
                  {photo?.likes}
                </Icon>
                <Icon>
                  <FontAwesomeIcon icon={faComment} />
                  {photo?.commentNumber}
                </Icon>
              </Icons>
            </Photo>
          ))}
      </Grid>
    </div>
  );
};

export default Profile;
