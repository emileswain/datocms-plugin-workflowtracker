import {RenderFieldExtensionCtx} from 'datocms-plugin-sdk';
import {ButtonGroup, ButtonGroupButton, Canvas, Spinner} from 'datocms-react-ui';
import {ManualExtensionParameters} from "../types";
import {useCallback, useEffect, useState} from "react";

import {SiteClient} from 'datocms-client';

import styles from './styles.module.css';
type Props = {
    ctx: RenderFieldExtensionCtx;
};

export function WorkflowTrackerExtension({ctx}: Props) {
    const parameters = ctx.parameters as ManualExtensionParameters;
    const [stages, setStages] = useState<string[]>([])
    const [spinnerID, setSpinnerID] = useState('');

    const quickLog = (val: any) => {
        if (parameters.devMode) console.log(val)
    }
    const logObject = (label: string, obj: any) => {
        console.log(`${label} : ${JSON.stringify(obj, null, 2)}`);
    }

    const [client, setClient] = useState(null)


    useEffect(() => {

        const itemWorkflow: any = ctx.itemType.relationships.workflow.data;

        logObject("current Access Token ", ctx.currentUserAccessToken);
        logObject("Field API_KEY: ", ctx.field.attributes.api_key);
        logObject("currentRole: ", ctx.currentRole);

        /**
         * Reset any visual status props, that may have changed as a result of the stage changing.
         */
        setSpinnerID('');

        /**
         * Create and store a reference to the datacms-client. Used by button callback.
         */
        if (client === null) {
            setClient(new SiteClient(ctx.currentUserAccessToken, {
                environment: ctx.environment,
            }));
            return;
        }

        /**
         * Build list of buttons for user to adjust the stage.
         */
        let tmpStages: any[] = [];
        // Are there types of client and workflow?
        (client as any).workflows.all()
            .then((workflows: any) => {

                workflows.forEach((workflow: any) => {
                    // Only include the workflow stages for this particular item.
                    if (itemWorkflow.id === workflow.id) {
                        workflow.stages.forEach((stage: any) => {
                            tmpStages.unshift({
                                ...stage,
                                key: stage.id,
                                selected: ctx!.item!.meta.stage === stage.id,
                                permitted: true,
                                updating: false,
                            });
                        });
                    }
                });
            }).then(() => {
            setStages(tmpStages)
        }).catch((error: any) => {
            console.error("Error " + error);
        });

        return function cleanup() {
            console.log("Cleaning up");
            setClient(null);
        };
    }, [client, ctx!.item!.meta.stage]);

    /**
     * Updates the status of the workflow.
     */
    const updateWorkflowStatus = useCallback(
        async (event) => {
            if (client !== null) {
                const itemID = ctx.item!.id;
                setSpinnerID(event);
                // display spinner
                const newStages = stages.map((item: any) => {
                    if (item.id === itemID) {
                        item.updating = true;
                        return item
                    } else {
                        return item;
                    }
                });
                //setStages(newStages);

                // Update data
                console.log("Client update Started ");
                (client as any)!.items!.update(itemID, {
                    meta: {stage: event},
                }).then(() => {
                    console.log("Client update complete.");
                    // this occurs a lot sooner than the actual update of the UI
                    // so moved setSpinnerID(''); to the main useEffect above.
                });
            }
        },
        [client, spinnerID]
    );


    return (
        <Canvas ctx={ctx}>
            {/*<h4>Stages</h4>*/}
            <ButtonGroup>

                {
                    stages.map((state: any) => {

                        return <ButtonGroupButton key={state.key}
                                                  selected={state.selected ? true : false}
                                                  onClick={() => updateWorkflowStatus(state.id)}
                                                  disabled={spinnerID !== '' ? true : false}
                        >{state.name} {spinnerID === state.id ?<Spinner placement="inline"/> : ''}</ButtonGroupButton>
                    })
                }
            </ButtonGroup>
            <div className={styles.form__hint}> View your current progress through the workflow. Click to update stage</div>
        </Canvas>
    );
}