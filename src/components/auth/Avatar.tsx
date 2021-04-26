import styled from 'styled-components';

interface ISAvatarProps {
  lg: boolean;
}

const SAvatar = styled.div<ISAvatarProps>`
  width: ${(props) => (props.lg ? '30px' : '25px')};
  height: ${(props) => (props.lg ? '30px' : '25px')};
  border-radius: 15px;
  background-color: #2c2c2c;
  overflow: hidden;
`;

const Img = styled.img`
  max-width: 100%;
`;

const Avatar = ({ url, lg = false }: { url: string; lg?: boolean }) => {
  return (
    <SAvatar lg={lg}>
      <Img src={url} />
    </SAvatar>
  );
};

export default Avatar;
