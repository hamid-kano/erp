<?php

return [
    'required'  => 'The :attribute field is required.',
    'string'    => 'The :attribute field must be a string.',
    'max'       => ['string' => 'The :attribute field must not exceed :max characters.'],
    'min'       => ['numeric' => 'The :attribute field must be at least :min.'],
    'numeric'   => 'The :attribute field must be a number.',
    'integer'   => 'The :attribute field must be an integer.',
    'boolean'   => 'The :attribute field must be true or false.',
    'email'     => 'The :attribute field must be a valid email address.',
    'unique'    => 'The :attribute has already been taken.',
    'exists'    => 'The selected :attribute is invalid.',
    'in'        => 'The selected :attribute is invalid.',
    'date'      => 'The :attribute field must be a valid date.',
    'confirmed' => 'The :attribute confirmation does not match.',
    'different' => 'The :attribute and :other must be different.',

    'attributes' => [],
];
