import PropTypes from 'prop-types';
import React from 'react';
import { Form, Select } from 'antd';

SelectField.propTypes = {
    field: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired,

    label: PropTypes.string,
    placeholder: PropTypes.string,
    disabled: PropTypes.bool,
    options: PropTypes.array,
};

SelectField.defaultProps = {
    label: '',
    placeholder: '',
    disabled: false,
    options: [],
}

function SelectField(props) {
    const { field, form, options, label, placeholder, disabled, onChangeFromParent } = props;
    const { name, value } = field;
    const { errors, touched } = form;
    const showError = errors[name] && touched[name];

    const selectedOption = options.find(option => option.value === value);

    const handleSelectedOptionChange = (selectedOption) => {
        // const selectedValue = selectedOption ? selectedOption.value : selectedOption;
        onChangeFromParent(selectedOption);
    }

    return (
        <Form.Item
            label={label}
            validateStatus={showError ? 'error' : null}
            help={showError ? errors[name] : null}
        >
            <Select
                id={name}
                {...field}
                value={selectedOption}
                onChange={handleSelectedOptionChange}

                placeholder={placeholder}
                disabled={disabled}
                options={options}
            />
        </Form.Item>
    );
}

export default SelectField;