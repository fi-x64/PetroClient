import React, { useState } from 'react'
import { useMap } from 'react-leaflet'

import classNames from 'classnames/bind'
import styles from './Pane.module.scss'
import { CaretLeftOutlined } from '@ant-design/icons'
import { Button, Form, Input, Image, Drawer, InputNumber, DatePicker, Space, List } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faL, faLocationDot } from '@fortawesome/free-solid-svg-icons'
import InfoItem from '../../atom/InfoItem/InfoItem'
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

const cl = classNames.bind(styles)

function AddPane({ data, active, onClose, onGoToPosition, animateRef }) {
    const map = useMap();

    dayjs.extend(customParseFormat);
    const dateFormat = 'YYYY/MM/DD';
    const { RangePicker } = DatePicker;

    var [totalColumn, setTotalColumn] = useState(0);

    const onChange = (value) => {
        setTotalColumn(value);
    };

    const renderOptions = () => {
        let content = [];
        for (let i = 0; i < totalColumn; i++) {
            var labelText = "Nhập thông tin cột đo thứ " + (i + 1);
            content.push(
                <li key={i} style={{ marginLeft: "20px" }}>
                    <label>{labelText}</label>
                    <Form.Item
                        label={"Loại cột đo"}
                        name=""
                        rules={[{ required: true, message: 'Please input!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label={"Số cột đo"}
                        name=""
                        rules={[{ required: true, message: 'Please input!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label={"Số tem kiểm định"}
                        name=""
                        rules={[{ required: true, message: 'Please input!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label={"Hạn kiểm định"}
                        name=""
                        rules={[{ required: true, message: 'Please input!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label={"Ngày kiểm định"}
                        name=""
                        rules={[{ required: true, message: 'Please input!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <RangePicker
                        // defaultValue={[dayjs('2015/01/01', dateFormat), dayjs('2015/01/01', dateFormat)]}
                        placeholder={["Ngày kiểm định", "Hạn kiểm định"]}
                        format={dateFormat}
                        style={{ width: '100%', marginBottom: '20px' }}
                    />

                </li>
            )


        }
        return content;
    }

    return (
        <div >
            <Drawer title="Thêm cửa hàng mới" placement="left" onClose={onClose} open={active} mask={false}>
                <Form
                    name="basic"
                    layout='vertical'
                    autoComplete="off"
                >
                    <Form.Item
                        label="Tên cửa hàng"
                        name="username"
                        rules={[{ required: true, message: 'Vui lòng nhập tên cửa hàng!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Tên doanh nghiệp"
                        name="username"
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Địa chỉ"
                        name="username"
                        rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Kinh độ"
                        name="username"
                        rules={[{ required: true, message: 'Vui lòng nhập kinh độ' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Vĩ độ"
                        name="username"
                        rules={[{ required: true, message: 'Vui lòng nhập vĩ độ!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Số lượng cột đo"
                        name="numColumn"
                        rules={[{ required: true, message: 'Vui lòng nhập số lượng cột đo!' }]}
                    >
                        <InputNumber min={1} onChange={onChange} style={{ width: '100%' }} />
                    </Form.Item>

                    <ul>
                        {renderOptions()}
                    </ul>

                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                        <Button type="primary" htmlType="submit">
                            Lưu thông tin
                        </Button>
                    </Form.Item>
                </Form>
            </Drawer>
            {/* <div onClick={onClose} className={cl('toggle')}>
                <CaretLeftOutlined />
            </div> */}
        </div>
    )
}

export default AddPane
