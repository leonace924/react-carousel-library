import styled from '@emotion/styled'

export const CarouselContainer = styled.div`
  position: relative;
  overflow: hidden;
  width: 100%;
`

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