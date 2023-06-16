module.exports = grammar({
  name: 'corn',

  extras: $ => [
    $.comment,
    /\s/,
  ],

  rules: {
    source_file: $ => seq(
      optional($.assign_block),
      $.object
    ),

    assign_block: $ => seq(
      "let",
      "{",
      repeat($.assignment),
      "}",
      "in"
    ),

    assignment: $ => seq(
      $.input,
      "=",
      $.value
    ),

    input: $ => token(seq(
      "$",
      /[A-z_]/,
      repeat1(/[A-z0-9_]/)
    )),

    value: $ => choice(
      $.object,
      $.array,
      $.input,
      $.string,
      $.float,
      $.integer,
      $.boolean,
      $.null
    ),

    object: $ => seq(
      "{",
      repeat($._object_value),
      "}"
    ),

    _object_value: $ => choice(
      $.pair,
      $.spread
    ),

    array: $ => seq(
      "[",
      repeat($._array_value),
      "]"
    ),

    _array_value: $ => choice(
      $.value,
      $.spread
    ),

    pair: $ => seq(
      $.path,
      "=",
      $.value
    ),

    path: $ => seq(
      $.path_seg,
      repeat(seq(
        ".",
        $.path_seg
      ))
    ),

    path_seg: $ => repeat1(/[^=.\s]/),

    string: $ => seq(
      '"',
      repeat(choice($.input, $.char)),
      '"'
    ),

    char: $ => /[^\"\r\n]/,

    float: $ => seq(
      optional("-"),
      /\d+/,
      ".",
      /\d+/,
      optional($._exponent)
    ),

    _exponent: $ => seq(
      "e",
      choice("+", "-"),
      /\d+/
    ),

    integer: $ => choice(
      $._hex_integer,
      $._decimal_integer
    ),

    _decimal_integer: $=> seq(
      optional("-"),
      /\d+/,
      repeat(/_?\d+/)
    ),
    
    _hex_integer: $ => seq(
      "0x",
      /[0-9a-fA-F]+/
    ),

    boolean: $ => choice(
      "true",
      "false"
    ),

    null: $ => "null",

    spread: $ => seq(
      "..",
      $.input
    ),

    comment: $ => token(seq('//', /[^\n]*/)),
  }
});
