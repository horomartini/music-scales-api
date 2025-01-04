import grpc from '../proto/grpc'


export interface ApolloContext {
  grpc: typeof grpc.Client
}

export const createContext = (): ApolloContext => ({ grpc: grpc.Client })
