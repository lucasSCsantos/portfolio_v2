'use client';

import styled from 'styled-components';
import { Box } from '../ui/default';

export const Container = styled.section`
  overflow: hidden;
  height: 110vh;
  display: flex;
  position: relative;
  justify-content: center;
  padding-top: 128px;
  z-index: 98;
  background-color: transparent;
`;

export const ExperienceContainer = styled(Box)`
  position: relative;
  border-radius: 24px;
  width: 542px;
  height: 305px;
  background-size: cover;
  background-position: center;

  &:hover {
    .experience-icon {
      transform: translateX(-178px) scale(0.6);
      transition: 0.9s ease;
      border-radius: 20px;
    }

    .experience-content {
      transform: translateY(90%);
      transition: 1s ease;
      display: flex;
      height: auto;
      border-radius: 0 0 24px 24px;
    }
  }
`;

export const ExperienceIcon = styled(Box)`
  z-index: 1;
  width: 144px;
  height: 144px;
  position: absolute;
  top: 75%;
  border-radius: 30px;
  transition: 1s ease;
  box-shadow: 10px 15px 29px rgba(0, 0, 0, 0.25);
  background-size: cover;
  background-position: center;
`;

export const ExperienceContent = styled(Box)`
  z-index: -1;
  background-color: pink;
  transform: scaleY(0.8);
  width: 542px;
  overflow: hidden;
  border-radius: 24px;
  padding: 82px 52px 32px;
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  transition: 1s ease;
`;

ExperienceContent.defaultProps = { className: 'experience-content' };
ExperienceIcon.defaultProps = { className: 'experience-icon' };
