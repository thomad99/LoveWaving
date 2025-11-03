import { PDFDocument } from 'pdf-lib'

export interface FormField {
  name: string
  type: 'text' | 'date' | 'checkbox' | 'signature' | 'select'
  value?: string
  required?: boolean
  placeholder?: string
  options?: string[]
}

/**
 * Parse a PDF to extract form fields
 */
export async function parsePDFForm(pdfBuffer: Buffer): Promise<FormField[]> {
  try {
    const pdfDoc = await PDFDocument.load(pdfBuffer)
    const form = pdfDoc.getForm()
    const fields = form.getFields()
    
    const formFields: FormField[] = []
    
    for (const field of fields) {
      const fieldName = field.getName()
      const fieldType = field.constructor.name
      
      // Map common field names to standard types
      const mappedField = mapFieldToStandard(fieldName, fieldType)
      
      if (mappedField) {
        formFields.push(mappedField)
      }
    }
    
    return formFields
  } catch (error) {
    console.error('Error parsing PDF:', error)
    return []
  }
}

/**
 * Map field names to standard field types based on common patterns
 */
function mapFieldToStandard(fieldName: string, fieldType: string): FormField | null {
  const nameLower = fieldName.toLowerCase()
  
  // Determine field type from field constructor
  let type: FormField['type'] = 'text'
  
  if (fieldType.includes('Button') || fieldType.includes('CheckBox')) {
    type = 'checkbox'
  } else if (fieldType.includes('Dropdown') || fieldType.includes('Choice')) {
    type = 'select'
  } else if (nameLower.includes('date') || nameLower.includes('dob')) {
    type = 'date'
  } else if (nameLower.includes('signature') || nameLower.includes('sign') || nameLower.includes('agree')) {
    type = 'signature'
  }
  
  // Map to standard field names
  let standardName = fieldName
  
  // Name fields
  if (nameLower.includes('firstname') || nameLower.includes('given name')) {
    standardName = 'firstName'
  } else if (nameLower.includes('lastname') || nameLower.includes('family name') || nameLower.includes('surname')) {
    standardName = 'lastName'
  } else if (nameLower.includes('fullname') || nameLower.includes('name') && !nameLower.includes('emergency')) {
    standardName = 'fullName'
  } else if (nameLower.includes('skipper')) {
    standardName = 'skipper'
  } else if (nameLower.includes('sailor')) {
    standardName = 'sailor'
  } else if (nameLower.includes('parent') || nameLower.includes('guardian')) {
    standardName = 'parent'
  }
  
  // Contact fields
  else if (nameLower.includes('phone') || nameLower.includes('mobile') || nameLower.includes('cell')) {
    standardName = 'phone'
  } else if (nameLower.includes('email')) {
    standardName = 'email'
  } else if (nameLower.includes('address') && !nameLower.includes('emergency')) {
    standardName = 'address'
  }
  
  // Date fields
  else if (nameLower.includes('date') || nameLower.includes('dob') || nameLower.includes('birth date')) {
    standardName = 'date'
  }
  
  // Medical fields
  else if (nameLower.includes('medical') || nameLower.includes('allergy') || nameLower.includes('condition')) {
    standardName = 'medicalInfo'
  }
  
  // Emergency contact fields
  else if (nameLower.includes('emergency') && nameLower.includes('name')) {
    standardName = 'emergencyName'
  } else if (nameLower.includes('emergency') && (nameLower.includes('phone') || nameLower.includes('contact'))) {
    standardName = 'emergencyPhone'
  } else if (nameLower.includes('emergency') && nameLower.includes('address')) {
    standardName = 'emergencyAddress'
  }
  
  return {
    name: standardName,
    type,
    required: true, // Assume all fields are required for now
  }
}

/**
 * Fill a PDF form with provided data
 */
export async function fillPDFForm(
  pdfBuffer: Buffer,
  formData: Record<string, string | boolean>
): Promise<Buffer> {
  try {
    const pdfDoc = await PDFDocument.load(pdfBuffer)
    const form = pdfDoc.getForm()
    
    for (const [key, value] of Object.entries(formData)) {
      try {
        const field = form.getTextField(key) || form.getCheckBox(key) || form.getRadioGroup(key)
        
        if (field) {
          const fieldType = field.constructor.name
          
          if (fieldType.includes('Text')) {
            if (typeof value === 'string') {
              ;(field as any).setText(value)
            }
          } else if (fieldType.includes('CheckBox')) {
            if (typeof value === 'boolean') {
              ;(field as any).check()
            }
          } else if (fieldType.includes('Radio')) {
            if (typeof value === 'string') {
              ;(field as any).select(value)
            }
          }
        }
      } catch (error) {
        // Field might not exist or be of different type, skip it
        console.log(`Could not fill field ${key}:`, error)
      }
    }
    
    const pdfBytes = await pdfDoc.save()
    return Buffer.from(pdfBytes)
  } catch (error) {
    console.error('Error filling PDF:', error)
    throw error
  }
}

/**
 * Detect if a PDF has form fields
 */
export async function hasFormFields(pdfBuffer: Buffer): Promise<boolean> {
  try {
    const pdfDoc = await PDFDocument.load(pdfBuffer)
    const form = pdfDoc.getForm()
    const fields = form.getFields()
    return fields.length > 0
  } catch (error) {
    return false
  }
}

