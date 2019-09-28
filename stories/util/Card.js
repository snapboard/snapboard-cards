import React from 'react'
import styled from '@emotion/styled'
import Center from './Center'

const Container = styled.div`
  background: #fafafa;
  height: 100%;
`

const StyledCard = styled.div`
	border: 1px solid #eee;
	border-radius: 3px;
	width: 100%;
  height: 100%;
  background: #fff;
  overflow: hidden;
`

export default function Card ({ children, width = 400, height = 400 }) {
  return (
    <Container>
      <Center width={width} height={height}>
        <StyledCard>
          {children}
        </StyledCard>
      </Center>
    </Container>
  )
}