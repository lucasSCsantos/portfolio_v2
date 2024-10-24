import Image from 'next/image';
import Halo from './Halo';
import { AvatarContainer } from './styles';

export default function Avatar() {
  return (
    <AvatarContainer
      style={{
        position: 'relative',
        width: 150,
        height: 150
      }}
      initial={{ opacity: 0, y: 0 }} 
      animate={{ opacity: 1, y: [0, 10, 0] }} 
      transition={{
        opacity: { ease: 'easeInOut', duration: 0.8 }, 
        y: {
          duration: 16,         
          // delay: 0,          
          repeat: Infinity,     
          ease: 'easeInOut',     
          repeatType: 'reverse' 
        }
      }}
    >
      <Halo duration={24} width="145px">
        <path
          fill="#0063A3"
          d="M43.1,-74.8C56.7,-66.8,69.3,-57,78,-44.3C86.6,-31.5,91.4,-15.7,91.5,0C91.6,15.8,86.9,31.6,78.2,44.4C69.5,57.1,56.8,66.7,43.1,74.3C29.4,81.8,14.7,87.4,-0.8,88.7C-16.2,90.1,-32.5,87.2,-45.3,79.2C-58.1,71.1,-67.5,57.7,-74,43.7C-80.6,29.6,-84.3,14.8,-84.7,-0.3C-85.2,-15.3,-82.4,-30.6,-75.7,-44.5C-69.1,-58.4,-58.6,-70.9,-45.4,-79.2C-32.1,-87.4,-16.1,-91.5,-0.7,-90.3C14.7,-89.2,29.5,-82.9,43.1,-74.8Z"
          transform="translate(100 100)"
        />
      </Halo>
      <Halo rotate={-360} width="135px" duration={18}>
        <path
          fill="#70BED7"
          d="M47.6,-75.5C61.4,-65.2,72.1,-51.5,79.4,-36.1C86.7,-20.7,90.6,-3.5,89.2,13.5C87.9,30.6,81.2,47.6,70.1,60.9C58.9,74.1,43.1,83.6,26.5,87C9.9,90.3,-7.5,87.5,-24.5,82.8C-41.6,78.1,-58.3,71.5,-70.3,59.7C-82.3,48,-89.6,30.9,-90.7,13.9C-91.8,-3.1,-86.6,-20.2,-78.9,-35.5C-71.1,-50.9,-60.7,-64.7,-47.2,-75.1C-33.6,-85.5,-16.8,-92.7,0.1,-92.8C16.9,-92.9,33.8,-85.9,47.6,-75.5Z"
          transform="translate(100 100)"
        />
      </Halo>
      <Image
        src="/avatar.jpeg"
        width={110}
        height={110}
        alt="Imagem avatar de Lucas"
        style={{
          userSelect: 'none',
          borderRadius: '100%',
          cursor: 'none',
          pointerEvents: 'none',
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)'
        }}
      />
    </AvatarContainer>
  );
}
