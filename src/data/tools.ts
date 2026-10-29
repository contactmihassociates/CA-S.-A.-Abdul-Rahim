// Calculator data for the /tools/ pages: generated metadata (tools.json) plus page copy (tool-copy.json).
import data from './tools.json';
import copyData from './tool-copy.json';
import { SRC } from './site';

export interface ToolCopy { h1: string; title: string; description: string; summary: string; steps: string[]; note: string }
export interface Tool { key: string; label: string; cat: string; catLabel: string; title: string; em: string; sub: string; copy: ToolCopy }

const copies: Record<string, ToolCopy> = copyData;

const fallback = (t: Omit<Tool, 'copy'>): ToolCopy => ({
  h1: `${t.label} calculator`,
  title: `${t.label} calculator`.slice(0, 44),
  description: `${t.label} calculator for ${t.catLabel.toLowerCase()}: enter your figures and see the working for the selected year. General information only.`.slice(0, 150),
  summary: t.sub || `Work out ${t.label.toLowerCase()} for the selected year from the figures you enter, with the working shown step by step.`,
  steps: ['Choose the tax year.', 'Enter your figures.', 'Check the working and the notes before relying on the result.'],
  note: 'The result is an estimate for the figures entered and is not a filed return or professional advice.',
});

export const CATEGORY_LABEL: Record<string, string> = {
  tax: 'Direct tax', indirect: 'GST', tds: 'TDS and TCS', compliance: 'Compliance', finance: 'Money and loans', nri: 'NRI and cross-border', utilities: 'Generators and utilities',
};
export const CATEGORY_INTRO: Record<string, string> = {
  tax: 'Income tax under the old and new regimes, capital gains, HRA, deductions, advance tax and interest.',
  indirect: 'GST on invoices, returns, interest, late fees, refunds, composition and e-way bills.',
  tds: 'TDS and TCS rates, thresholds and late interest, including TDS on property and salary.',
  compliance: 'Due dates, audit limits, presumptive income, penalties, payroll contributions and depreciation.',
  finance: 'EMI, PPF, NPS, retirement, fixed deposits and other personal finance planning.',
  nri: 'Residential status, DTAA, NRI repatriation, foreign tax credit and cross-border TDS.',
  utilities: 'Rent receipts and format checks for PAN, GSTIN and other identifiers.',
};
export const CATEGORY_SERVICE: Record<string, string> = {
  tax: '/income-tax-return-filing-chennai/', indirect: '/gst-return-filing/', tds: '/tds-return-filing/', compliance: '/tax-audit/',
  finance: '/income-tax-return-filing-chennai/', nri: '/nri-taxation-itr-chennai/', utilities: '/income-tax-return-filing-chennai/',
};
export const CATEGORY_SOURCES: Record<string, { href: string; label: string }[]> = {
  tax: [SRC.itPortal, SRC.itIndia], indirect: [SRC.gst, SRC.cbic], tds: [SRC.itPortal, SRC.traces], compliance: [SRC.itIndia, SRC.mca],
  finance: [SRC.itIndia, SRC.rbi], nri: [SRC.itPortal, SRC.rbi], utilities: [SRC.itPortal, SRC.gst],
};

export const TOOLS: Tool[] = data.tools.map((t) => ({ ...t, copy: copies[t.key] ?? fallback(t) }));
export const CATEGORIES = data.categories.map((c) => ({ ...c, label: CATEGORY_LABEL[c.k] ?? c.label, intro: CATEGORY_INTRO[c.k] ?? '' }));
export const TOOLKIT = { app: data.app, css: data.css };
