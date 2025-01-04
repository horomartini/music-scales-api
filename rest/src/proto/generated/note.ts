// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.6.1
//   protoc               v5.29.1
// source: note.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";
import {
  type CallOptions,
  ChannelCredentials,
  Client,
  type ClientOptions,
  type ClientUnaryCall,
  type handleUnaryCall,
  makeGenericClientConstructor,
  Metadata,
  type ServiceError,
  type UntypedServiceImplementation,
} from "@grpc/grpc-js";
import { Note } from "./common";

export const protobufPackage = "notes";

export interface GetNoteRequest {
  /** Required; ID of the note to retrieve, must be a valid id per database schema; Supports AIP-217 */
  id: string;
}

export interface GetNoteResponse {
  /** Retrieved note based on ID */
  note: Note | undefined;
}

export interface GetNotesRequest {
  /** Optional; Filtering; Supports AIP-160 */
  filter: string;
  /** Optional; Ordering; Supports AIP-132 */
  orderBy: string;
  /** Optional; Paginating; Supports AIP-158 */
  pageSize: number;
  /** Optional; Conceptually treated as 'Page x', where x is page number in range [1, +INF] */
  pageToken: string;
}

export interface GetNotesResponse {
  /** Ordered and filtered array of items */
  notes: Note[];
  /** Total number of items in database before filter, order and pagination */
  totalCount: number;
  /** Next page cursor token as per AIP-158 */
  nextPageToken: string;
  /** Total number of pages generated from given page_size in request */
  totalPages: number;
}

export interface AddNoteRequest {
  /** Required; Name of new note */
  name: string;
}

export interface AddNoteResponse {
  /** Newly created note */
  note: Note | undefined;
}

export interface UpdateNoteRequest {
  /** Required; ID of the note to update; Supports AIP-217 */
  id: string;
  /** Optional; New name to overwrite old note with */
  name: string;
}

export interface UpdateNoteResponse {
  /** Updated note */
  note: Note | undefined;
}

export interface DeleteNoteRequest {
  /** Required; ID of the note to delete; Supports AIP-217 */
  id: string;
}

export interface DeleteNoteResponse {
  /** ID of the deleted note */
  id: string;
}

function createBaseGetNoteRequest(): GetNoteRequest {
  return { id: "" };
}

export const GetNoteRequest: MessageFns<GetNoteRequest> = {
  encode(message: GetNoteRequest, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): GetNoteRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetNoteRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.id = reader.string();
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): GetNoteRequest {
    return { id: isSet(object.id) ? globalThis.String(object.id) : "" };
  },

  toJSON(message: GetNoteRequest): unknown {
    const obj: any = {};
    if (message.id !== "") {
      obj.id = message.id;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GetNoteRequest>, I>>(base?: I): GetNoteRequest {
    return GetNoteRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<GetNoteRequest>, I>>(object: I): GetNoteRequest {
    const message = createBaseGetNoteRequest();
    message.id = object.id ?? "";
    return message;
  },
};

function createBaseGetNoteResponse(): GetNoteResponse {
  return { note: undefined };
}

export const GetNoteResponse: MessageFns<GetNoteResponse> = {
  encode(message: GetNoteResponse, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.note !== undefined) {
      Note.encode(message.note, writer.uint32(10).fork()).join();
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): GetNoteResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetNoteResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.note = Note.decode(reader, reader.uint32());
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): GetNoteResponse {
    return { note: isSet(object.note) ? Note.fromJSON(object.note) : undefined };
  },

  toJSON(message: GetNoteResponse): unknown {
    const obj: any = {};
    if (message.note !== undefined) {
      obj.note = Note.toJSON(message.note);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GetNoteResponse>, I>>(base?: I): GetNoteResponse {
    return GetNoteResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<GetNoteResponse>, I>>(object: I): GetNoteResponse {
    const message = createBaseGetNoteResponse();
    message.note = (object.note !== undefined && object.note !== null) ? Note.fromPartial(object.note) : undefined;
    return message;
  },
};

function createBaseGetNotesRequest(): GetNotesRequest {
  return { filter: "", orderBy: "", pageSize: 0, pageToken: "" };
}

export const GetNotesRequest: MessageFns<GetNotesRequest> = {
  encode(message: GetNotesRequest, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.filter !== "") {
      writer.uint32(10).string(message.filter);
    }
    if (message.orderBy !== "") {
      writer.uint32(18).string(message.orderBy);
    }
    if (message.pageSize !== 0) {
      writer.uint32(24).int32(message.pageSize);
    }
    if (message.pageToken !== "") {
      writer.uint32(34).string(message.pageToken);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): GetNotesRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetNotesRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.filter = reader.string();
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }

          message.orderBy = reader.string();
          continue;
        }
        case 3: {
          if (tag !== 24) {
            break;
          }

          message.pageSize = reader.int32();
          continue;
        }
        case 4: {
          if (tag !== 34) {
            break;
          }

          message.pageToken = reader.string();
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): GetNotesRequest {
    return {
      filter: isSet(object.filter) ? globalThis.String(object.filter) : "",
      orderBy: isSet(object.orderBy) ? globalThis.String(object.orderBy) : "",
      pageSize: isSet(object.pageSize) ? globalThis.Number(object.pageSize) : 0,
      pageToken: isSet(object.pageToken) ? globalThis.String(object.pageToken) : "",
    };
  },

  toJSON(message: GetNotesRequest): unknown {
    const obj: any = {};
    if (message.filter !== "") {
      obj.filter = message.filter;
    }
    if (message.orderBy !== "") {
      obj.orderBy = message.orderBy;
    }
    if (message.pageSize !== 0) {
      obj.pageSize = Math.round(message.pageSize);
    }
    if (message.pageToken !== "") {
      obj.pageToken = message.pageToken;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GetNotesRequest>, I>>(base?: I): GetNotesRequest {
    return GetNotesRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<GetNotesRequest>, I>>(object: I): GetNotesRequest {
    const message = createBaseGetNotesRequest();
    message.filter = object.filter ?? "";
    message.orderBy = object.orderBy ?? "";
    message.pageSize = object.pageSize ?? 0;
    message.pageToken = object.pageToken ?? "";
    return message;
  },
};

function createBaseGetNotesResponse(): GetNotesResponse {
  return { notes: [], totalCount: 0, nextPageToken: "", totalPages: 0 };
}

export const GetNotesResponse: MessageFns<GetNotesResponse> = {
  encode(message: GetNotesResponse, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    for (const v of message.notes) {
      Note.encode(v!, writer.uint32(10).fork()).join();
    }
    if (message.totalCount !== 0) {
      writer.uint32(16).int32(message.totalCount);
    }
    if (message.nextPageToken !== "") {
      writer.uint32(26).string(message.nextPageToken);
    }
    if (message.totalPages !== 0) {
      writer.uint32(32).int32(message.totalPages);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): GetNotesResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetNotesResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.notes.push(Note.decode(reader, reader.uint32()));
          continue;
        }
        case 2: {
          if (tag !== 16) {
            break;
          }

          message.totalCount = reader.int32();
          continue;
        }
        case 3: {
          if (tag !== 26) {
            break;
          }

          message.nextPageToken = reader.string();
          continue;
        }
        case 4: {
          if (tag !== 32) {
            break;
          }

          message.totalPages = reader.int32();
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): GetNotesResponse {
    return {
      notes: globalThis.Array.isArray(object?.notes) ? object.notes.map((e: any) => Note.fromJSON(e)) : [],
      totalCount: isSet(object.totalCount) ? globalThis.Number(object.totalCount) : 0,
      nextPageToken: isSet(object.nextPageToken) ? globalThis.String(object.nextPageToken) : "",
      totalPages: isSet(object.totalPages) ? globalThis.Number(object.totalPages) : 0,
    };
  },

  toJSON(message: GetNotesResponse): unknown {
    const obj: any = {};
    if (message.notes?.length) {
      obj.notes = message.notes.map((e) => Note.toJSON(e));
    }
    if (message.totalCount !== 0) {
      obj.totalCount = Math.round(message.totalCount);
    }
    if (message.nextPageToken !== "") {
      obj.nextPageToken = message.nextPageToken;
    }
    if (message.totalPages !== 0) {
      obj.totalPages = Math.round(message.totalPages);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GetNotesResponse>, I>>(base?: I): GetNotesResponse {
    return GetNotesResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<GetNotesResponse>, I>>(object: I): GetNotesResponse {
    const message = createBaseGetNotesResponse();
    message.notes = object.notes?.map((e) => Note.fromPartial(e)) || [];
    message.totalCount = object.totalCount ?? 0;
    message.nextPageToken = object.nextPageToken ?? "";
    message.totalPages = object.totalPages ?? 0;
    return message;
  },
};

function createBaseAddNoteRequest(): AddNoteRequest {
  return { name: "" };
}

export const AddNoteRequest: MessageFns<AddNoteRequest> = {
  encode(message: AddNoteRequest, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.name !== "") {
      writer.uint32(10).string(message.name);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): AddNoteRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAddNoteRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.name = reader.string();
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): AddNoteRequest {
    return { name: isSet(object.name) ? globalThis.String(object.name) : "" };
  },

  toJSON(message: AddNoteRequest): unknown {
    const obj: any = {};
    if (message.name !== "") {
      obj.name = message.name;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<AddNoteRequest>, I>>(base?: I): AddNoteRequest {
    return AddNoteRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<AddNoteRequest>, I>>(object: I): AddNoteRequest {
    const message = createBaseAddNoteRequest();
    message.name = object.name ?? "";
    return message;
  },
};

function createBaseAddNoteResponse(): AddNoteResponse {
  return { note: undefined };
}

export const AddNoteResponse: MessageFns<AddNoteResponse> = {
  encode(message: AddNoteResponse, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.note !== undefined) {
      Note.encode(message.note, writer.uint32(10).fork()).join();
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): AddNoteResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAddNoteResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.note = Note.decode(reader, reader.uint32());
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): AddNoteResponse {
    return { note: isSet(object.note) ? Note.fromJSON(object.note) : undefined };
  },

  toJSON(message: AddNoteResponse): unknown {
    const obj: any = {};
    if (message.note !== undefined) {
      obj.note = Note.toJSON(message.note);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<AddNoteResponse>, I>>(base?: I): AddNoteResponse {
    return AddNoteResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<AddNoteResponse>, I>>(object: I): AddNoteResponse {
    const message = createBaseAddNoteResponse();
    message.note = (object.note !== undefined && object.note !== null) ? Note.fromPartial(object.note) : undefined;
    return message;
  },
};

function createBaseUpdateNoteRequest(): UpdateNoteRequest {
  return { id: "", name: "" };
}

export const UpdateNoteRequest: MessageFns<UpdateNoteRequest> = {
  encode(message: UpdateNoteRequest, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.name !== "") {
      writer.uint32(18).string(message.name);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): UpdateNoteRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUpdateNoteRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.id = reader.string();
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }

          message.name = reader.string();
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): UpdateNoteRequest {
    return {
      id: isSet(object.id) ? globalThis.String(object.id) : "",
      name: isSet(object.name) ? globalThis.String(object.name) : "",
    };
  },

  toJSON(message: UpdateNoteRequest): unknown {
    const obj: any = {};
    if (message.id !== "") {
      obj.id = message.id;
    }
    if (message.name !== "") {
      obj.name = message.name;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<UpdateNoteRequest>, I>>(base?: I): UpdateNoteRequest {
    return UpdateNoteRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<UpdateNoteRequest>, I>>(object: I): UpdateNoteRequest {
    const message = createBaseUpdateNoteRequest();
    message.id = object.id ?? "";
    message.name = object.name ?? "";
    return message;
  },
};

function createBaseUpdateNoteResponse(): UpdateNoteResponse {
  return { note: undefined };
}

export const UpdateNoteResponse: MessageFns<UpdateNoteResponse> = {
  encode(message: UpdateNoteResponse, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.note !== undefined) {
      Note.encode(message.note, writer.uint32(10).fork()).join();
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): UpdateNoteResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUpdateNoteResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.note = Note.decode(reader, reader.uint32());
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): UpdateNoteResponse {
    return { note: isSet(object.note) ? Note.fromJSON(object.note) : undefined };
  },

  toJSON(message: UpdateNoteResponse): unknown {
    const obj: any = {};
    if (message.note !== undefined) {
      obj.note = Note.toJSON(message.note);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<UpdateNoteResponse>, I>>(base?: I): UpdateNoteResponse {
    return UpdateNoteResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<UpdateNoteResponse>, I>>(object: I): UpdateNoteResponse {
    const message = createBaseUpdateNoteResponse();
    message.note = (object.note !== undefined && object.note !== null) ? Note.fromPartial(object.note) : undefined;
    return message;
  },
};

function createBaseDeleteNoteRequest(): DeleteNoteRequest {
  return { id: "" };
}

export const DeleteNoteRequest: MessageFns<DeleteNoteRequest> = {
  encode(message: DeleteNoteRequest, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): DeleteNoteRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDeleteNoteRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.id = reader.string();
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): DeleteNoteRequest {
    return { id: isSet(object.id) ? globalThis.String(object.id) : "" };
  },

  toJSON(message: DeleteNoteRequest): unknown {
    const obj: any = {};
    if (message.id !== "") {
      obj.id = message.id;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<DeleteNoteRequest>, I>>(base?: I): DeleteNoteRequest {
    return DeleteNoteRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<DeleteNoteRequest>, I>>(object: I): DeleteNoteRequest {
    const message = createBaseDeleteNoteRequest();
    message.id = object.id ?? "";
    return message;
  },
};

function createBaseDeleteNoteResponse(): DeleteNoteResponse {
  return { id: "" };
}

export const DeleteNoteResponse: MessageFns<DeleteNoteResponse> = {
  encode(message: DeleteNoteResponse, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): DeleteNoteResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDeleteNoteResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.id = reader.string();
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): DeleteNoteResponse {
    return { id: isSet(object.id) ? globalThis.String(object.id) : "" };
  },

  toJSON(message: DeleteNoteResponse): unknown {
    const obj: any = {};
    if (message.id !== "") {
      obj.id = message.id;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<DeleteNoteResponse>, I>>(base?: I): DeleteNoteResponse {
    return DeleteNoteResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<DeleteNoteResponse>, I>>(object: I): DeleteNoteResponse {
    const message = createBaseDeleteNoteResponse();
    message.id = object.id ?? "";
    return message;
  },
};

export type NoteServiceService = typeof NoteServiceService;
export const NoteServiceService = {
  getNote: {
    path: "/notes.NoteService/GetNote",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: GetNoteRequest) => Buffer.from(GetNoteRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => GetNoteRequest.decode(value),
    responseSerialize: (value: GetNoteResponse) => Buffer.from(GetNoteResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => GetNoteResponse.decode(value),
  },
  getNotes: {
    path: "/notes.NoteService/GetNotes",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: GetNotesRequest) => Buffer.from(GetNotesRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => GetNotesRequest.decode(value),
    responseSerialize: (value: GetNotesResponse) => Buffer.from(GetNotesResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => GetNotesResponse.decode(value),
  },
  addNote: {
    path: "/notes.NoteService/AddNote",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: AddNoteRequest) => Buffer.from(AddNoteRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => AddNoteRequest.decode(value),
    responseSerialize: (value: AddNoteResponse) => Buffer.from(AddNoteResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => AddNoteResponse.decode(value),
  },
  updateNote: {
    path: "/notes.NoteService/UpdateNote",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: UpdateNoteRequest) => Buffer.from(UpdateNoteRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => UpdateNoteRequest.decode(value),
    responseSerialize: (value: UpdateNoteResponse) => Buffer.from(UpdateNoteResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => UpdateNoteResponse.decode(value),
  },
  deleteNote: {
    path: "/notes.NoteService/DeleteNote",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: DeleteNoteRequest) => Buffer.from(DeleteNoteRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => DeleteNoteRequest.decode(value),
    responseSerialize: (value: DeleteNoteResponse) => Buffer.from(DeleteNoteResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => DeleteNoteResponse.decode(value),
  },
} as const;

export interface NoteServiceServer extends UntypedServiceImplementation {
  getNote: handleUnaryCall<GetNoteRequest, GetNoteResponse>;
  getNotes: handleUnaryCall<GetNotesRequest, GetNotesResponse>;
  addNote: handleUnaryCall<AddNoteRequest, AddNoteResponse>;
  updateNote: handleUnaryCall<UpdateNoteRequest, UpdateNoteResponse>;
  deleteNote: handleUnaryCall<DeleteNoteRequest, DeleteNoteResponse>;
}

export interface NoteServiceClient extends Client {
  getNote(
    request: GetNoteRequest,
    callback: (error: ServiceError | null, response: GetNoteResponse) => void,
  ): ClientUnaryCall;
  getNote(
    request: GetNoteRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: GetNoteResponse) => void,
  ): ClientUnaryCall;
  getNote(
    request: GetNoteRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: GetNoteResponse) => void,
  ): ClientUnaryCall;
  getNotes(
    request: GetNotesRequest,
    callback: (error: ServiceError | null, response: GetNotesResponse) => void,
  ): ClientUnaryCall;
  getNotes(
    request: GetNotesRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: GetNotesResponse) => void,
  ): ClientUnaryCall;
  getNotes(
    request: GetNotesRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: GetNotesResponse) => void,
  ): ClientUnaryCall;
  addNote(
    request: AddNoteRequest,
    callback: (error: ServiceError | null, response: AddNoteResponse) => void,
  ): ClientUnaryCall;
  addNote(
    request: AddNoteRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: AddNoteResponse) => void,
  ): ClientUnaryCall;
  addNote(
    request: AddNoteRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: AddNoteResponse) => void,
  ): ClientUnaryCall;
  updateNote(
    request: UpdateNoteRequest,
    callback: (error: ServiceError | null, response: UpdateNoteResponse) => void,
  ): ClientUnaryCall;
  updateNote(
    request: UpdateNoteRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: UpdateNoteResponse) => void,
  ): ClientUnaryCall;
  updateNote(
    request: UpdateNoteRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: UpdateNoteResponse) => void,
  ): ClientUnaryCall;
  deleteNote(
    request: DeleteNoteRequest,
    callback: (error: ServiceError | null, response: DeleteNoteResponse) => void,
  ): ClientUnaryCall;
  deleteNote(
    request: DeleteNoteRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: DeleteNoteResponse) => void,
  ): ClientUnaryCall;
  deleteNote(
    request: DeleteNoteRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: DeleteNoteResponse) => void,
  ): ClientUnaryCall;
}

export const NoteServiceClient = makeGenericClientConstructor(NoteServiceService, "notes.NoteService") as unknown as {
  new (address: string, credentials: ChannelCredentials, options?: Partial<ClientOptions>): NoteServiceClient;
  service: typeof NoteServiceService;
  serviceName: string;
};

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}

export interface MessageFns<T> {
  encode(message: T, writer?: BinaryWriter): BinaryWriter;
  decode(input: BinaryReader | Uint8Array, length?: number): T;
  fromJSON(object: any): T;
  toJSON(message: T): unknown;
  create<I extends Exact<DeepPartial<T>, I>>(base?: I): T;
  fromPartial<I extends Exact<DeepPartial<T>, I>>(object: I): T;
}
