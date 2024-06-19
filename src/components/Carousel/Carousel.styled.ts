import styled from '@emotion/styled'
import { animated } from '@react-spring/web'

export const CarouselContainer = styled.div`
  position: relative;
  overflow: hidden;
  width: 100%;
`

export const CarouselWrapper = styled.div`
  display: flex;
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
`

export const CarouselTrack = styled(animated.div)`
  display: flex;
  top: 0;
  left: 0;
  position: relative;
  width: 100%;
  touch-action: none;
`

export const CarouselItem = styled.div<{itemsPerSlide: number}>`
  display: flex;
  position: relative;
  flex: 1 0 calc(100% / ${({ itemsPerSlide }) => itemsPerSlide});
`;

export const CarouselButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  font-size: 24px;
  border: none;
  cursor: pointer;
  z-index: 1;
`

export const PrevButton = styled(CarouselButton)`
  left: 10px;
`

export const NextButton = styled(CarouselButton)`
  right: 10px;
`

export const Div = styled.div``
