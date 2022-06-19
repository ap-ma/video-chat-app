import { Dispatch, SetStateAction } from 'react'

//  ----------------------------------------------------------------------------
//  Local state types
//  ----------------------------------------------------------------------------

/** Local State ContactInfoUserId */
export type ContactInfoUserId = string | undefined

/** Local State Set ContactInfoUserId */
export type SetContactInfoUserId = Dispatch<SetStateAction<ContactInfoUserId>>
