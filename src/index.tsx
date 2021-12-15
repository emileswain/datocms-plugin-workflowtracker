import {connect, Field, FieldIntentCtx, IntentCtx, RenderManualFieldExtensionConfigScreenCtx} from 'datocms-plugin-sdk';
import {render} from './utils/render';
import ConfigScreen from './entrypoints/ConfigScreen';
import 'datocms-react-ui/styles.css';
// import SidebarBlockField from "./entrypoints/SidebarBlockField";
import {WorkflowTrackerExtension} from "./entrypoints/WorkflowTrackerExtension";
import {WorkflowTrackerConfigScreen} from "./entrypoints/WorkflowTrackerConfigScreen";

// const allowedFieldTypes = ["boolean"] as NonNullable<PluginAttributes["field_types"]>;


connect({
    renderConfigScreen(ctx) {
        return render(<ConfigScreen ctx={ctx}/>);
    },

    itemFormSidebarPanels() {
        return [
            // {
            //     id: 'workflowtrackersidebar',
            //     label: 'Workflow Tracker Plugin',
            // }
        ];
    },
    // renderItemFormSidebarPanel(sidebarPaneID, ctx) {
    //     render(<SidebarBlockField ctx={ctx}/>);
    // },

    manualFieldExtensions(ctx: IntentCtx) {
        return [
            // {
            //     id: 'workflowtracker',
            //     name: 'Workflow Tracker Plugin',
            //     type: 'addon',
            //     fieldTypes: ['string'],
            //     configurable: true,
            // },
        ];
    },
    renderFieldExtension(id, ctx) {
        render(<WorkflowTrackerExtension ctx={ctx}/>);
    },

    renderManualFieldExtensionConfigScreen(
        fieldExtensionId: string,
        ctx: RenderManualFieldExtensionConfigScreenCtx
    ) {
        render(<WorkflowTrackerConfigScreen ctx={ctx}/>);
    },

    overrideFieldExtensions(field: Field, ctx: FieldIntentCtx) {
        //console.log(`overrideFieldExtensions ${JSON.stringify(field.attributes, null, 2)}`);
        if (
            field.attributes.field_type === 'string' &&
            field.attributes.api_key === 'workflowfield'
        ) {
            return {
                editor: { id: 'workflowtracker' },
            };
        }
    },
}).then(() => {
});
