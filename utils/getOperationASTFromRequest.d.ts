import { DocumentNode, OperationDefinitionNode } from 'graphql';
import { ExecutionRequest } from './Interfaces';
export declare function getOperationASTFromDocument(documentNode: DocumentNode, operationName?: string): OperationDefinitionNode;
export declare const getOperationASTFromRequest: (request: ExecutionRequest) => OperationDefinitionNode;
