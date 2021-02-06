import React from 'react'

export default class BuggyCounter extends React.Component<{}, { counter: number }> {
    public state: { counter: number }

	constructor(props: any) {
		super(props)
		this.state = { counter: 0 }
		this.handleClick = this.handleClick.bind(this)
	}

	handleClick() {
		this.setState(({ counter }) => ({ counter: counter + 1 }))
	}

	render() {
		if (this.state.counter === 5) {
			// Simulate a JS error
			throw new Error('I crashed!')
		}
		return <h1 onClick={this.handleClick}>{this.state.counter}</h1>
	}
}