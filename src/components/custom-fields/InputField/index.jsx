import PropTypes from 'prop-types';
import React from 'react';
import { Form, Input, InputNumber, Typography } from 'antd';
import { getIn } from 'formik';
const { Text, Link } = Typography;

InputField.propTypes = {
    field: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired,

    type: PropTypes.string,
    label: PropTypes.string,
    placeholder: PropTypes.string,
    disabled: PropTypes.bool,
};

InputField.defaultProps = {
    type: 'text',
    label: '',
    placeholder: '',
    disabled: false,
}

function InputField(props) {
    const {
        field, form,
        type, label, placeholder, disabled, min, max
    } = props;
    const { name } = field;
    const { errors, touched } = form;
    const showError = getIn(errors, `${name}`) && getIn(touched, `${name}`);
    console.log("Check errors: ", errors);
    console.log(`Check errors[${name}]`, getIn(errors, `${name}`));
    return (
        <Form.Item
            label={label}
            validateStatus={showError ? 'error' : null}
            help={showError ? getIn(errors, `${name}`) : null}
        >
            <Input
                id={name}
                {...field}

                type={type}
                min={min ? min : null}
                max={max ? max : null}
                disabled={disabled}
                placeholder={placeholder}
            />
            {/* {showError && <Text type="danger">{errors[name]}</Text>} */}
        </Form.Item>
    );
}

export default InputField;