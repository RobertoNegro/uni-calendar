import React, {Component} from "react";
import { Form} from "react-bootstrap";

interface SearchBarState {
    courses:null
}
interface SearchBarProps {
    label: string
    name: string
    value: string
    onChange: React.ChangeEventHandler<HTMLInputElement>;
}

export class SearchBar extends Component<SearchBarProps, SearchBarState> {
    constructor(props: any) {
        super(props);
        this.state = {
            courses: null,
        }
    }
    render() {
        return (
            // <Form.Group controlId="exampleForm.SelectCustom">
            //     <Form.Label>Custom select</Form.Label>
            //     <Form.Control as="select" name={this.props.name} onChange={this.props.onChange} custom>
            //         <option value={this.props.value}>1</option>
            //     </Form.Control>
            // </Form.Group>
            <Form.Group controlId="search-course">
                <Form.Label>{this.props.label}</Form.Label>
                <Form.Control type="text" name={this.props.name} value={this.props.value} placeholder={this.props.label} onChange={this.props.onChange}/>
            </Form.Group>
        );
    }
}
