import React, {Fragment} from 'react';
import { 
	Grid, 
	Dropdown, 
	Container, 
	Button, 
	Popup, 
	Input, 
	Checkbox, 
	Label, 
	Header,
    Tab	
} from 'semantic-ui-react';

import 'semantic-ui-css/semantic.min.css';

const panes = [
		{ menuItem: 'Auto Acknowledge Policy', render: () => <Tab.Pane>{<AcknowledgementPolicy/>}</Tab.Pane> },
		{ menuItem: 'Auto Severity Escalation', render: () => <Tab.Pane>{<EscalationPolicy/>}</Tab.Pane> }, ]

function PolicyTab() {  
  return (
		<Container>
			<Header textAlign= "centered" size="large">Fault Policies</Header>
				<Tab menu={{tabular: true, attached: true}}panes={panes} />
		</Container>
	);
}

class Fault extends React.Component {
    render() {
        return(
            <Fragment>
            <Checkbox label='Critical' size='medium' /><br />
            <Checkbox label='Major' /><br />
            <Checkbox label='Minor' /><br />
            <Checkbox label='Warning' /><br />
            <Checkbox label='Information' />
            </Fragment>
        )
    }
}

class EscalationPolicy extends React.Component {
    render() {
        const options = [
            { key: 1, text: 'Critical', value: 1 },
            { key: 2, text: 'Major', value: 2 },
            { key: 3, text: 'Minor', value: 3 },
            { key: 4, text: 'Warning', value: 4 },
            { key: 5, text: 'Information', value: 5 }]
    return(
		<Grid>
		<Container>
		<Label attached='top left' size='large'>Escalating Faults</Label>
		<Grid>
			<Grid.Row>
				<Grid.Column width={5}>
					<PolicyBox />
				</Grid.Column>
				<Grid.Column width={5}>
					<Input labelPosition='right' type='number'>
					<Label basic>Older Than</Label>
					<Input />
					<Label>Days</Label>
					<Input />
					<Label>Hours</Label>
					</Input>
					<Container>
					<strong>To Severity:</strong>
					<Dropdown clearable options={options} selection />
					</Container>
					</Grid.Column>
					</Grid.Row>
					</Grid>
					<Button size='tiny' floated="right" color="red">Cancel</Button>
					<Button size='tiny' floated="right" color="blue">Update</Button>            
		    </Container>
		</Grid>
        )
	}
}

class AcknowledgementPolicy extends React.Component {
    render() {
        return (
            <Grid>
            <Container>
            <Label attached='top left' size='large'>Auto Acknowldgement</Label>
            <Grid>
                <Grid.Row>
                    <Grid.Column width={5}>
                        <PolicyBox />
                    </Grid.Column>
                    <Grid.Column width={5}>
                        <Input labelPosition='right' type='number'>
                            <Label basic>Older Than</Label>
                            <input />
                            <Label>Days</Label>
                            <input />
                            <Label>Hours</Label>
                        </Input>
                        <Input labelPosition='right' type='number'>
                                <Label basic>Retain Min</Label>
                                <input />
                                <Label>Faults</Label>
                        </Input>
                    </Grid.Column>   
                </Grid.Row>
            </Grid>
            <Popup
            content='Fault Acknowldge successful'
            on='click'
            pinned
            trigger={<Button size='tiny' floated="right" color="blue" content='OK' />}/>
          
                <Button size='tiny' floated="right" color="red">Cancel</Button>
               
           </Container> 
           </Grid>
        )
    }
}

class FaultPolicy extends React.Component {
	render() {
		return (
			<div><PolicyTab/></div>
		)
	}
}

export default FaultPolicy;