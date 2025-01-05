import type { ClientOptions } from '@grpc/grpc-js'

import { ChannelCredentials, credentials } from '@grpc/grpc-js'

import { 
  NoteServiceClient, 
  GetNoteRequest, 
  GetNoteResponse, 
  GetNotesRequest, 
  GetNotesResponse, 
  AddNoteRequest, 
  AddNoteResponse, 
  UpdateNoteRequest, 
  UpdateNoteResponse, 
  DeleteNoteRequest, 
  DeleteNoteResponse, 
} from './__generated__/note'
import { 
  InstrumentServiceClient, 
  GetInstrumentRequest, 
  GetInstrumentResponse, 
  GetInstrumentsRequest, 
  GetInstrumentsResponse, 
  AddInstrumentRequest, 
  AddInstrumentResponse, 
  UpdateInstrumentRequest, 
  UpdateInstrumentResponse, 
  DeleteInstrumentRequest, 
  DeleteInstrumentResponse, 
} from './__generated__/instrument'
import { 
  TuningServiceClient, 
  GetTuningRequest, 
  GetTuningResponse, 
  GetTuningsRequest, 
  GetTuningsResponse, 
  AddTuningRequest, 
  AddTuningResponse, 
  UpdateTuningRequest, 
  UpdateTuningResponse, 
  DeleteTuningRequest, 
  DeleteTuningResponse, 
} from './__generated__/tuning'
import { 
  ScaleServiceClient, 
  GetScaleRequest, 
  GetScaleResponse, 
  GetScalesRequest, 
  GetScalesResponse, 
  AddScaleRequest, 
  AddScaleResponse, 
  UpdateScaleRequest, 
  UpdateScaleResponse, 
  DeleteScaleRequest, 
  DeleteScaleResponse, 
} from './__generated__/scale'


abstract class Client {
  public static init = (address: string, credentials: ChannelCredentials, options?: Partial<ClientOptions>) => {
    this.Note = new NoteService(new NoteServiceClient(address, credentials, options))
    this.Instrument = new InstrumentService(new InstrumentServiceClient(address, credentials, options))
    this.Tuning = new TuningService(new TuningServiceClient(address, credentials, options))
    this.Scale = new ScaleService(new ScaleServiceClient(address, credentials, options))
  }

  public static Note?: NoteService = undefined
  public static Instrument?: InstrumentService = undefined
  public static Tuning?: TuningService = undefined
  public static Scale?: ScaleService = undefined
}

class NoteService {
  private service: NoteServiceClient

  public constructor(service: NoteServiceClient) {
    this.service = service
  }

  public get = async (request: GetNoteRequest): Promise<GetNoteResponse> => new Promise((resolve, reject) => {
    this.service.getNote(request, (error, response) => error ? reject(error) : resolve(response))
  })

  public getMany = async (request: GetNotesRequest): Promise<GetNotesResponse> => new Promise((resolve, reject) => {
    this.service.getNotes(request, (error, response) => error ? reject(error) : resolve(response))
  })

  public add = async (request: AddNoteRequest): Promise<AddNoteResponse> => new Promise((resolve, reject) => {
    this.service.addNote(request, (error, response) => error ? reject(error) : resolve(response))
  })

  public update = async (request: UpdateNoteRequest): Promise<UpdateNoteResponse> => new Promise((resolve, reject) => {
    this.service.updateNote(request, (error, response) => error ? reject(error) : resolve(response))
  })

  public delete = async (request: DeleteNoteRequest): Promise<DeleteNoteResponse> => new Promise((resolve, reject) => {
    this.service.deleteNote(request, (error, response) => error ? reject(error) : resolve(response))
  })

  public req = {
    get: GetNoteRequest.create, 
    getMany: GetNotesRequest.create, 
    add: AddNoteRequest.create, 
    update: UpdateNoteRequest.create, 
    delete: DeleteNoteRequest.create, 
  }
}

class InstrumentService {
  private service: InstrumentServiceClient

  public constructor(service: InstrumentServiceClient) {
    this.service = service
  }

  public get = async (request: GetInstrumentRequest): Promise<GetInstrumentResponse> => new Promise((resolve, reject) => {
    this.service.getInstrument(request, (error, response) => error ? reject(error) : resolve(response))
  })

  public getMany = async (request: GetInstrumentsRequest): Promise<GetInstrumentsResponse> => new Promise((resolve, reject) => {
    this.service.getInstruments(request, (error, response) => error ? reject(error) : resolve(response))
  })

  public add = async (request: AddInstrumentRequest): Promise<AddInstrumentResponse> => new Promise((resolve, reject) => {
    this.service.addInstrument(request, (error, response) => error ? reject(error) : resolve(response))
  })

  public update = async (request: UpdateInstrumentRequest): Promise<UpdateInstrumentResponse> => new Promise((resolve, reject) => {
    this.service.updateInstrument(request, (error, response) => error ? reject(error) : resolve(response))
  })

  public delete = async (request: DeleteInstrumentRequest): Promise<DeleteInstrumentResponse> => new Promise((resolve, reject) => {
    this.service.deleteInstrument(request, (error, response) => error ? reject(error) : resolve(response))
  })

  public req = {
    get: GetInstrumentRequest.create, 
    getMany: GetInstrumentsRequest.create, 
    add: AddInstrumentRequest.create, 
    update: UpdateInstrumentRequest.create, 
    delete: DeleteInstrumentRequest.create, 
  }
}

class TuningService {
  private service: TuningServiceClient

  public constructor(service: TuningServiceClient) {
    this.service = service
  }

  public get = async (request: GetTuningRequest): Promise<GetTuningResponse> => new Promise((resolve, reject) => {
    this.service.getTuning(request, (error, response) => error ? reject(error) : resolve(response))
  })

  public getMany = async (request: GetTuningsRequest): Promise<GetTuningsResponse> => new Promise((resolve, reject) => {
    this.service.getTunings(request, (error, response) => error ? reject(error) : resolve(response))
  })

  public add = async (request: AddTuningRequest): Promise<AddTuningResponse> => new Promise((resolve, reject) => {
    this.service.addTuning(request, (error, response) => error ? reject(error) : resolve(response))
  })

  public update = async (request: UpdateTuningRequest): Promise<UpdateTuningResponse> => new Promise((resolve, reject) => {
    this.service.updateTuning(request, (error, response) => error ? reject(error) : resolve(response))
  })

  public delete = async (request: DeleteTuningRequest): Promise<DeleteTuningResponse> => new Promise((resolve, reject) => {
    this.service.deleteTuning(request, (error, response) => error ? reject(error) : resolve(response))
  })

  public req = {
    get: GetTuningRequest.create, 
    getMany: GetTuningsRequest.create, 
    add: AddTuningRequest.create, 
    update: UpdateTuningRequest.create, 
    delete: DeleteTuningRequest.create, 
  }
}

class ScaleService {
  private service: ScaleServiceClient

  public constructor(service: ScaleServiceClient) {
    this.service = service
  }

  public get = async (request: GetScaleRequest): Promise<GetScaleResponse> => new Promise((resolve, reject) => {
    this.service.getScale(request, (error, response) => error ? reject(error) : resolve(response))
  })

  public getMany = async (request: GetScalesRequest): Promise<GetScalesResponse> => new Promise((resolve, reject) => {
    this.service.getScales(request, (error, response) => error ? reject(error) : resolve(response))
  })

  public add = async (request: AddScaleRequest): Promise<AddScaleResponse> => new Promise((resolve, reject) => {
    this.service.addScale(request, (error, response) => error ? reject(error) : resolve(response))
  })

  public update = async (request: UpdateScaleRequest): Promise<UpdateScaleResponse> => new Promise((resolve, reject) => {
    this.service.updateScale(request, (error, response) => error ? reject(error) : resolve(response))
  })

  public delete = async (request: DeleteScaleRequest): Promise<DeleteScaleResponse> => new Promise((resolve, reject) => {
    this.service.deleteScale(request, (error, response) => error ? reject(error) : resolve(response))
  })

  public req = {
    get: GetScaleRequest.create, 
    getMany: GetScalesRequest.create, 
    add: AddScaleRequest.create, 
    update: UpdateScaleRequest.create, 
    delete: DeleteScaleRequest.create, 
  }
}


export default {
  Client,
  getInsecureCredentials: credentials.createInsecure
}
