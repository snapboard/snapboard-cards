import path from 'path'
import React from 'react'
import styled from '@emotion/styled'
import { storiesOf } from '@storybook/react'
import { object, withKnobs } from '@storybook/addon-knobs'
import { action } from '@storybook/addon-actions'
import Center from './Center'

const Card = styled.div`
	border: 1px solid #eee;
	border-radius: 3px;
	width: 100%;
	height: 100%;
`

const req = require.context('../cards', true, /component\/Card\.js$/);

req.keys().forEach((key) => {
	const name = key.substr(2).split('/')[0]
	const folder = name.split('-')[0]
	const mod = require(`../cards/${key.substr(2)}`)
	storiesOf(`Cards/${folder}`, module)
  	.add(name, () => {
			const css = require(`../cards/${name}/component/styles.css`).default
			const testParams = require(`../cards/${name}/component/testParams.js`).default
			const CardContent = mod.default
			const props = object('Props', testParams || {}) || {}
  		return (
  			<Center width={400} height={400}>
					<Card>
  					<CardContent update={action('update')} {...props} />
					</Card>
  				<style dangerouslySetInnerHTML={{ __html: css }} />
  			</Center>
  		)
  	}).addDecorator(withKnobs)
})
