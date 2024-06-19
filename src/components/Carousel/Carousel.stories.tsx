/** @jsxImportSource @emotion/react */
import { FC } from 'react'
import styled from '@emotion/styled'
import { Meta, StoryObj } from '@storybook/react'
import Carousel, { CarouselProps } from './Carousel'
import { mockedItems } from './mocked-data'
import { JSX } from '@emotion/react/jsx-runtime'

export default {
  component: Carousel,
  title: 'Carousel',
} as Meta

type Story = StoryObj<typeof Carousel>

interface SliderItemProps {
  children: React.ReactNode
}

const Item = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  color: #fff;
  font-size: 3.2rem;
  cursor: -webkit-grab;
  cursor: grab;
  min-height: 200px;
`

const SliderItem: FC<SliderItemProps> = ({ children, ...rest }) => {
  return <Item {...rest}>{children}</Item>
}

export const Default: Story = (args: JSX.IntrinsicAttributes & CarouselProps) => {
  return (
    <Carousel {...args}>
      {mockedItems.map(({ id, label, ...rest }) => (
        <SliderItem {...rest} key={id}>
          {label}
        </SliderItem>
      ))}
    </Carousel>
  )
}

Default.args = {
  hasNavigation: true,
}

export const MultipleItems = Default
MultipleItems.args = {
  ...Default.args,
  itemsPerSlide: 3,
  isInfinite: true,
}
