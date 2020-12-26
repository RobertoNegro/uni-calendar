import React from "react";
import { Typeahead, TypeaheadLabelKey } from "react-bootstrap-typeahead";
import { Form } from "react-bootstrap";

interface SearchBarProps<T extends object> {
  label: string;
  data: T[];
  handleChange: (selected: T[]) => void;
  labelKey: TypeaheadLabelKey<T>;
  defaultSelected?: T | T[];
}

export class SearchBar<T extends object> extends React.Component<
  SearchBarProps<T>,
  any
> {
  render() {
    return (
      <div>
        <Form.Group>
          <Form.Label>{this.props.label}</Form.Label>
          <Typeahead
            id="basic-typeahead-single"
            labelKey={this.props.labelKey}
            onChange={this.props.handleChange}
            options={this.props.data}
            defaultSelected={
              this.props.defaultSelected
                ? Array.isArray(this.props.defaultSelected)
                  ? this.props.defaultSelected
                  : [this.props.defaultSelected]
                : undefined
            }
            placeholder={this.props.label}
          />
        </Form.Group>
      </div>
    );
  }
}
