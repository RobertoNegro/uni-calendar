import React from "react";
import { Typeahead } from 'react-bootstrap-typeahead';
import { Form} from "react-bootstrap";

interface SearchBarProps {
    label: string,
    data: {id: number, name: string}[],
    handleChange:(selected: {id: number, name: string}[]) => void,
}

export class SearchBar extends React.Component<SearchBarProps, any> {
    render() {
        return (
            <div>
                <Form.Group>
                    <Form.Label>{this.props.label}</Form.Label>
                    <Typeahead
                        id="basic-typeahead-single"
                        labelKey="name"
                        onChange={this.props.handleChange}
                        options={this.props.data}
                        placeholder={this.props.label}
                    />
                </Form.Group>
            </div>
        );
    }
}
