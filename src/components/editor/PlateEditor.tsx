import React from 'react'
import {
    ColorPickerToolbarDropdown,
    HeadingToolbar,
    ImageToolbarButton,
    LineHeightToolbarDropdown,
    LinkToolbarButton,
    MARK_BG_COLOR,
    MARK_COLOR,
    MediaEmbedToolbarButton,
    Plate,
    TNode
} from '@udecode/plate'
import {Check, FontDownload, FormatColorText, Image, LineWeight, Link, OndemandVideo} from "@mui/icons-material";
import {
    AlignToolbarButtons,
    BasicElementToolbarButtons,
    BasicMarkToolbarButtons,
    IndentToolbarButtons,
    KbdToolbarButton,
    ListToolbarButtons,
    MarkBallonToolbar,
    TableToolbarButtons
} from "./Toolbars";

import {config} from "./config";
import {plugins} from "./plugins";

export interface EditorProps {
    id: string,
    readOnly: boolean,
    initialData: TNode[],
    onChange: (content: TNode[]) => void
}

const defaultValue = [{type: "p", children: [{text: "I am empty with " + Math.random()}]}]

const PlateEditor: React.FC<EditorProps> = ({id, readOnly, initialData, onChange}) => {
    if (readOnly) {
        return readOnlyEditor(id, initialData)
    }
    return basicEditor({id, initialData, onChange})
}

const readOnlyEditor = (id: string, initialValue: TNode[]) => {
    return <Plate
        id={"readonly-" + id}
        editableProps={{
            readOnly: true
        }}
        plugins={plugins}
        value={initialValue.length === 0 ? defaultValue : initialValue}
    />
}

const basicEditor = (props: {id: string, initialData: TNode[], onChange: (content: TNode[]) => void}) => {
    return <Plate
        id={props.id}
        editableProps={config.editableProps}
        plugins={plugins}
        initialValue={props.initialData.length === 0 ? defaultValue : props.initialData}
        onChange={props.onChange}
    >
        <HeadingToolbar>
            <BasicElementToolbarButtons/>
            <ListToolbarButtons/>
            <IndentToolbarButtons/>
            <BasicMarkToolbarButtons/>
            <ColorPickerToolbarDropdown
                pluginKey={MARK_COLOR}
                icon={<FormatColorText/>}
                selectedIcon={<Check/>}
                tooltip={{content: 'Text color'}}
            />
            <ColorPickerToolbarDropdown
                pluginKey={MARK_BG_COLOR}
                icon={<FontDownload/>}
                selectedIcon={<Check/>}
                tooltip={{content: 'Highlight color'}}
            />
            <AlignToolbarButtons/>
            <LineHeightToolbarDropdown icon={<LineWeight/>}/>
            <LinkToolbarButton icon={<Link/>}/>
            <ImageToolbarButton icon={<Image/>}/>
            <MediaEmbedToolbarButton icon={<OndemandVideo/>}/>
            <KbdToolbarButton/>
            <TableToolbarButtons/>
        </HeadingToolbar>
        <MarkBallonToolbar/>
    </Plate>
}

export default PlateEditor