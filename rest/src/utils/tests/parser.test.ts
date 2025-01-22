import { describe, beforeAll, it, expect } from 'vitest'
import * as func from '../parser'

describe('isType', () => {
  let schema = {} as const

  describe('schema with one primitive, required property', () => {
    beforeAll(() => {
      schema = {
        name: { type: String, required: true },
      } as const
    })

    it('should return true for correct value', () => {
      const value = { name: 'text' }
      const result = func.isType(value, schema)
      expect(result).toBe(true)
    })

    it ('should return false for wrong value', () => {
      const value = { name: 5 }
      const result = func.isType(value, schema)
      expect(result).toBe(false)
    })

    it('should return false for null', () => {
      const value = { name: null }
      const result = func.isType(value, schema)
      expect(result).toBe(false)
    })

    it('should return false for undefined', () => {
      const value = { name: undefined }
      const result = func.isType(value, schema)
      expect(result).toBe(false)
    })

    it('should return false for empty array', () => {
      const value = { name: [] }
      const result = func.isType(value, schema)
      expect(result).toBe(false)
    })

    it('should return false for non-empty array', () => {
      const value = { name: [1, 2, 3] }
      const result = func.isType(value, schema)
      expect(result).toBe(false)
    })

    it('should return false for non-empty array with items of same type as schema property', () => {
      const value = { name: ['1', '2', '3'] }
      const result = func.isType(value, schema)
      expect(result).toBe(false)
    })

    it('should return false for empty object', () => {
      const value = { name: {} }
      const result = func.isType(value, schema)
      expect(result).toBe(false)
    })

    it('should return false for non-empty object', () => {
      const value = { name: { prop: 'value' } }
      const result = func.isType(value, schema)
      expect(result).toBe(false)
    })

    it('should return false for correct value type, but with property missing from schema', () => {
      const value = { name: 'text', prop: 5 }
      const result = func.isType(value, schema)
      expect(result).toBe(false)
    })
  })

  describe('schema with one primitive, required and one primitive, optional property', () => {
    beforeAll(() => {
      schema = {
        name: { type: String, required: true },
        option: { type: Boolean },
      } as const
    })

    it('should return true for correct required value without optional property', () => {
      const value = { name: 'text' }
      const result = func.isType(value, schema)
      expect(result).toBe(true)
    })

    it('should return true for correct required value with correct optional property', () => {
      const value = { name: 'text', option: true }
      const result = func.isType(value, schema)
      expect(result).toBe(true)
    })

    it('should return true for correct required value with null for optional property', () => {
      const value = { name: 'text', option: null }
      const result = func.isType(value, schema)
      expect(result).toBe(true)
    })

    it('should return true for correct required value with undefined for optional property', () => {
      const value = { name: 'text', option: undefined }
      const result = func.isType(value, schema)
      expect(result).toBe(true)
    })

    it('should return false for wrong value without optional property', () => {
      const value = { name: 5 }
      const result = func.isType(value, schema)
      expect(result).toBe(false)
    })

    it('should return false for wrong value with correct optional property', () => {
      const value = { name: 5, option: false }
      const result = func.isType(value, schema)
      expect(result).toBe(false)
    })

    it('should return false for correct required value, but incorrect optional property', () => {
      const value = { name: 'text', option: 5 }
      const result = func.isType(value, schema)
      expect(result).toBe(false)
    })

    it('should return false for both required and optional incorrect properties', () => {
      const value = { name: 5, option: 5 }
      const result = func.isType(value, schema)
      expect(result).toBe(false)
    })

    it('should return false for required type being an empty array', () => {
      const value = { name: [] }
      const result = func.isType(value, schema)
      expect(result).toBe(false)
    })

    it('should return false for required type being a non-empty array', () => {
      const value = { name: [1, 2, 3] }
      const result = func.isType(value, schema)
      expect(result).toBe(false)
    })

    it('should return false for required type being a non-empty array with items of same type as schema property', () => {
      const value = { name: ['1', '2', '3'] }
      const result = func.isType(value, schema)
      expect(result).toBe(false)
    })

    it('should return false for required type being an empty object', () => {
      const value = { name: {} }
      const result = func.isType(value, schema)
      expect(result).toBe(false)
    })

    it('should return false for required type being a non-empty object', () => {
      const value = { name: { prop: 'value' } }
      const result = func.isType(value, schema)
      expect(result).toBe(false)
    })

    it('should return false for correct required and optional value types, but with property missing from schema', () => {
      const value = { name: 5, option: true, prop: 'text' }
      const result = func.isType(value, schema)
      expect(result).toBe(false)
    })
  })

  describe('schema with required primitive, optional primitive and optional array of objects with required primitive properties', () => {
    beforeAll(() => {
      schema = {
        name: { type: String, required: true },
        option: { type: Boolean },
        array: { type: Array, required: false, schema: {
          id: { type: Number, required: true },
          comment: { type: String, required: true },
        }},
      } as const
    })

    it('should return true for correct required primitive without optional properties', () => {
      const value = { name: 'text' }
      const result = func.isType(value, schema)
      expect(result).toBe(true)
    })

    it('should return true for correct required primitive and correct optional primitive and missing optional array', () => {
      const value = { name: 'text', option: true }
      const result = func.isType(value, schema)
      expect(result).toBe(true)
    })

    it('should return true for correct required and optional primitives and for correct optional array with one value having correct required properties', () => {
      const value = { name: 'text', option: true, array: [{ id: 1, comment: 'text' }] }
      const result = func.isType(value, schema)
      expect(result).toBe(true)
    })

    it('should return true for correct required and optional primitives and for correct optional array with two values having correct required properties', () => {
      const value = { name: 'text', option: true, array: [{ id: 1, comment: 'text' }, { id: 2, comment: 'text' }] }
      const result = func.isType(value, schema)
      expect(result).toBe(true)
    })

    it('should return true for correct required primitives, missing optional primitive and correct optional array with two values having correct required properties', () => {
      const value = { name: 'text', array: [{ id: 1, comment: 'text' }, { id: 2, comment: 'text' }] }
      const result = func.isType(value, schema)
      expect(result).toBe(true)
    })

    it('should return true for correct required primitives and empty array as optional array property', () => {
      const value = { name: 'text', array: [] }
      const result = func.isType(value, schema)
      expect(result).toBe(true)
    })

    it('should return true for correct required primitives and optional array property being null', () => {
      const value = { name: 'text', array: null }
      const result = func.isType(value, schema)
      expect(result).toBe(true)
    })

    it('should return true for correct required primitives and optional array property being undefined', () => {
      const value = { name: 'text', array: undefined }
      const result = func.isType(value, schema)
      expect(result).toBe(true)
    })

    it('should return false for missing required primitives and correct optional array with two values having correct required properties', () => {
      const value = { array: [{ id: 1, comment: 'text' }, { id: 2, comment: 'text' }] }
      const result = func.isType(value, schema)
      expect(result).toBe(false)
    })

    it('should return false for correct required primitives and array with incorrect values (primitives)', () => {
      const value = { name: 'text', array: [1, 2, 3] }
      const result = func.isType(value, schema)
      expect(result).toBe(false)
    })

    it('should return false for correct required primitives and array with one correct object and other object missing required property', () => {
      const value = { name: 'text', array: [{ id: 1, comment: 'text' }, { id: 2 }] }
      const result = func.isType(value, schema)
      expect(result).toBe(false)
    })

    it('should return false for correct required primitives and array with one correct object and other object with one incorrect property type', () => {
      const value = { name: 'text', array: [{ id: 1, comment: 'text' }, { id: 2, comment: 5 }] }
      const result = func.isType(value, schema)
      expect(result).toBe(false)
    })

    it('should return false for correct required primitives and array with correct objects, but with one object having a property missing from schema', () => {
      const value = { name: 'text', array: [{ id: 1, comment: 'text' }, { id: 2, comment: 'text', prop: false }] }
      const result = func.isType(value, schema)
      expect(result).toBe(false)
    })

    it('should return false for correct required primitives and array with one incorrect object missing required properties', () => {
      const value = { name: 'text', array: [{ id: 1 }] }
      const result = func.isType(value, schema)
      expect(result).toBe(false)
    })

    it('should return false for correct required primitives and array with one empty object', () => {
      const value = { name: 'text', array: [{}] }
      const result = func.isType(value, schema)
      expect(result).toBe(false)
    })

    it('should return false for correct required primitives and array with two empty objects', () => {
      const value = { name: 'text', array: [{}, {}] }
      const result = func.isType(value, schema)
      expect(result).toBe(false)
    })

    it('should return false for correct required primitives and array property being an empty object', () => {
      const value = { name: 'text', array: {} }
      const result = func.isType(value, schema)
      expect(result).toBe(false)
    })

    it('should return false for correct required primitives and array property being a non-empty object', () => {
      const value = { name: 'text', array: { prop: 'value' } }
      const result = func.isType(value, schema)
      expect(result).toBe(false)
    })
  })

  describe('schema with required primitive and a required array of required primitives', () => {
    beforeAll(() => {
      schema = {
        name: { type: String, required: true },
        array: { type: Array, required: true, schema: { type: Number, required: true } }
      } as const
    })

    it('should return true for correct required primitive and required array of required primitives', () => {
      const value = { name: 'text', array: [1, 2, 3] }
      const result = func.isType(value, schema)
      expect(result).toBe(true)
    })

    it('should return true for correct required primitive and required array of one required primitive', () => {
      const value = { name: 'text', array: [1] }
      const result = func.isType(value, schema)
      expect(result).toBe(true)
    })

    it('should return false for correct required primitive, but correct required array with incorrect primitives', () => {
      const value = { name: 'text', array: [true, false] }
      const result = func.isType(value, schema)
      expect(result).toBe(false)
    })

    it('should return false for correct required primitive, but correct required array with one incorrect primitive', () => {
      const value = { name: 'text', array: [true] }
      const result = func.isType(value, schema)
      expect(result).toBe(false)
    })

    it('should return false for correct required primitive, but correct required array with one incorrect primitive among correct primitives', () => {
      const value = { name: 'text', array: [1, 2, true] }
      const result = func.isType(value, schema)
      expect(result).toBe(false)
    })

    it('should return false for correct required primitive, but required array being null', () => {
      const value = { name: 'text', array: null }
      const result = func.isType(value, schema)
      expect(result).toBe(false)
    })

    it('should return false for correct required primitive, but required array being undefined', () => {
      const value = { name: 'text', array: undefined }
      const result = func.isType(value, schema)
      expect(result).toBe(false)
    })

    it('should return false for correct required primitive, but required array being primitive value', () => {
      const value = { name: 'text', array: 5 }
      const result = func.isType(value, schema)
      expect(result).toBe(false)
    })

    it('should return false for correct required primitive, but required array being an empty array', () => {
      const value = { name: 'text', array: [] }
      const result = func.isType(value, schema)
      expect(result).toBe(false)
    })

    it('should return false for correct required primitive, but required array being an empty object', () => {
      const value = { name: 'text', array: {} }
      const result = func.isType(value, schema)
      expect(result).toBe(false)
    })

    it('should return false for correct required primitive, but required array being a non-empty object', () => {
      const value = { name: 'text', array: { prop: 'value' } }
      const result = func.isType(value, schema)
      expect(result).toBe(false)
    })
  })
})