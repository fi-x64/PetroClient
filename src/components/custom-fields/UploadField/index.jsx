import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Form, Upload, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

UploadField.propTypes = {
    field: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired,

    type: PropTypes.string,
    label: PropTypes.string,
};

UploadField.defaultProps = {
    label: '',
}

function UploadField(props) {
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');

    const handleCancel = () => setPreviewOpen(false);

    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        setPreviewImage(file.url || (file.preview));
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };

    const {
        field, label
    } = props;
    const { name } = field;

    return (
        <Form.Item
            label={label}
        >
            <Upload
                id={name}
                // {...field}
                listType="picture-card"
                onPreview={handlePreview}
            // onChange={handleChange}
            >
                <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Tải ảnh</div>
                </div>
                <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </Upload>
        </Form.Item>
    );
}

export default UploadField;