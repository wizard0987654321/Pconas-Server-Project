/* ==========================================================================
 * BOOK THREAD A.12.7  services   (Chapter A: Appendix: generic parts used everywhere)
 * File: src/services/api/services.ts
 *
 * Services, customers and VMs requests.
 *
 * DATA - backend requests or types, renders no HTML.
 *
 * Uses: A.12.1 client, A.13 types
 * Table of contents: frontend/CODE_GUIDE.md
 * ========================================================================== */

import type { VM, Service, Customer } from "../../types"; // A.13 types
import { getJson, sendJson } from "./client"; // A.12.1 client

// VMs, services and customers (Device -> VM -> Service -> Customer)

export function getVmsData() {
    return getJson<VM[]>(`/vms`, "Failed to get VMs");
}

export function getServicesData() {
    return getJson<Service[]>(`/services`, "Failed to get services");
}

export function getCustomersData() {
    return getJson<Customer[]>(`/customers`, "Failed to get customers");
}

export function addVm(payload: { newVm: { deviceId: number; serviceId: number; name: string } }) {
    return sendJson("POST", `/addVm`, payload, "Failed to add VM");
}

export function addService(payload: { newService: { name: string; customerId: number } }) {
    return sendJson("POST", `/addService`, payload, "Failed to add service");
}

export function addCustomer(payload: { newCustomer: { name: string; phoneNumber: string } }) {
    return sendJson("POST", `/addCustomer`, payload, "Failed to add customer");
}

export async function deleteVm(id: number) {
    await sendJson("DELETE", `/deleteVm/${id}`, undefined, "Failed to delete VM");
}

export async function deleteService(id: number) {
    await sendJson("DELETE", `/deleteService/${id}`, undefined, "Failed to delete service");
}

export async function deleteCustomer(id: number) {
    await sendJson("DELETE", `/deleteCustomer/${id}`, undefined, "Failed to delete customer");
}

// → Next in the book: A.12.8 quiz  (src/services/api/quiz.ts)
