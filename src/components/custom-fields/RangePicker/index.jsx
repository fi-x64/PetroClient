import PropTypes from 'prop-types';
import React from 'react';
import { Form, DatePicker } from 'antd';
import dayjs from 'dayjs';

RangePicker.propTypes = {
    field: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired,

    label: PropTypes.string,
    placeholder: PropTypes.string,
    disabled: PropTypes.bool,
    options: PropTypes.array,
};

RangePicker.defaultProps = {
    label: '',
    placeholder: '',
    disabled: false,
    options: [],
}

function RangePicker(props) {
    const dateFormat = 'YYYY/MM/DD'
    const { RangePicker } = DatePicker

    const { field, label, placeholder, onChangeFromParent } = props;
    const { name } = field;
    const sendData = (value) => {
        onChangeFromParent(value);
    };

    return (
        <Form.Item
            label={label}
        >
            <RangePicker
                id={name}
                {...field}

                format={dateFormat}
                onChange={sendData}
            />
        </Form.Item>
    );
}

export default RangePicker;