import React, { useState } from 'react';
import { Row, Col, Button, Input, Card, Modal } from 'antd';
import { CaretRightOutlined, PlusOutlined } from '@ant-design/icons';
import { callVariant } from '@/lib/services/api';
import { Parameter } from '@/lib/Types';
interface TestViewProps {
    URIPath: string | null;
    inputParams: Parameter[] | null;
    optParams: Parameter[] | null;
}
const BoxComponent: React.FC<TestViewProps> = ({ inputParams, optParams, URIPath }) => {
    const { TextArea } = Input;
    const [results, setResults] = useState('');

    if (!inputParams) {
        return <div>Loading...</div>;
    }
    const [inputParamsDict, setInputParamsDict] = useState<Record<string, string>>(inputParams.reduce((dict, param) => ({ ...dict, [param.name]: param.default }), {}));
    const handleInputParamValChange = (inputParamName: string, newValue: string) => {
        setInputParamsDict(prevState => ({
            ...prevState,
            [inputParamName]: newValue
        }));
    };


    const handleRun = async () => {
        setResults("Loading..");
        try {
            const result = await callVariant(inputParamsDict, optParams, URIPath);
            setResults(result);
        } catch (e) {
            setResults("The code has resulted in the following error: \n\n --------------------- \n" + e + "---------------------\n\nPlease update your code, and re-serve it using cli and try again.\n\nFor more information please read https://docs.agenta.ai/docs/howto/how-to-debug");
        }
    }


    return (
        <>

            {/* 
            </Card> */}

            <Card
                style={{ marginTop: 16, border: '1px solid #ccc', marginRight: '24px', }}
                bodyStyle={{ padding: '4px 16px', border: '0px solid #ccc' }}
            >
                <h4 style={{ padding: '0px', marginTop: '8px', marginBottom: '8px' }}>Input parameters</h4>

                <Row style={{ marginTop: '16px' }}>
                    {Object.keys(inputParamsDict).map((key, index) => (
                        <TextArea
                            key={index}
                            placeholder={key}
                            onChange={e => handleInputParamValChange(key, e.target.value)}
                            style={{ height: '100%', width: '100%' }}
                        />
                    ))}
                </Row>
                <Row style={{ marginTop: '16px' }} >
                    <Col span={24} style={{ textAlign: 'right' }}>
                        <Button type="primary" shape="round" icon={<CaretRightOutlined />} onClick={handleRun} style={{ width: '100px' }}>Run</Button>
                    </Col>
                </Row>
                <Row style={{ marginTop: '16px', marginBottom: '16px' }}>
                    <TextArea value={results}
                        rows={6}
                        placeholder="Results will be shown here"
                        style={{ background: 'rgb(249 250 251)', height: '100%', width: '100%' }} />
                </Row>
            </Card >

        </>
    );
};

const App: React.FC<TestViewProps> = ({ inputParams, optParams, URIPath }) => {
    const [rows, setRows] = useState([0]);

    const handleAddRow = () => {
        setRows(prevRows => [...prevRows, prevRows.length]);
    };

    return (
        <div>
            {rows.map(row => (
                <BoxComponent key={row} inputParams={inputParams} optParams={optParams} URIPath={URIPath} />
            ))}
            <Button type="primary" size='large' icon={<PlusOutlined />} onClick={handleAddRow} style={{ marginTop: '16px', width: '200px', marginBottom: '24px' }}>Add Row</Button>
        </div>

    );
};

export default App;
