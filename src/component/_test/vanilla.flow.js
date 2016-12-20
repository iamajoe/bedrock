// @flow

import type {CompData as CommonCompData, S} from './common.flow.js';

export type CompData = CommonCompData & {
    els?: { [key: string]: ?Element[] },
    render?: boolean,
    tmpl?: string|FnTmpl|void
};

export type FnTmpl = (data: any) => string;
export type FnGetTmplFn = (tmpl: string|FnTmpl|void) => FnTmpl;
export type FnRender = (el: ?Element[], tmpl: FnTmpl, state: S, renderedTmpl: ?string) => string;
export type FnDestroy = (el: ?Element[]) => void;