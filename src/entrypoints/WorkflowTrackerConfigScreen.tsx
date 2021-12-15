import {RenderManualFieldExtensionConfigScreenCtx} from "datocms-plugin-sdk";
import {Canvas, Form, SwitchField} from "datocms-react-ui";
import {useCallback, useEffect, useState} from "react";
import {ManualExtensionParameters} from "../types";

type PropTypes = {
    ctx: RenderManualFieldExtensionConfigScreenCtx;
};

export function WorkflowTrackerConfigScreen({ctx}: PropTypes) {

    const [pluginParameters, setPluginParameters] = useState<Partial<ManualExtensionParameters>>(ctx.parameters);
    const parameters = ctx.parameters as ManualExtensionParameters;

    const quickLog = (val: any) => {
        if (parameters.devMode) console.log(val)
    }

    /**
     * update a single parameter field.
     */
    const update = useCallback(
        (field, value) => {
            const newParameters = {...pluginParameters, [field]: value};
            setPluginParameters(newParameters);
            ctx.setParameters(newParameters).then(() => {
            });
        },
        [pluginParameters, setPluginParameters, ctx]
    );


    /**
     */
    useEffect(  ()  => {


    }, [parameters]);

    return (
        <Canvas ctx={ctx}>
            <Form>
                 <SwitchField
                    id="devMode"
                    name="devMode"
                    label="Enable DebugMode"
                    value={pluginParameters.devMode || false}
                    onChange={update.bind(null, "devMode")}
                />
                <div>Binds the field to the workflow status and renders it nicely.</div>


            </Form>
        </Canvas>
    );
}
