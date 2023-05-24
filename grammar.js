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
      /[^\"\r\n]*/,
      '"'
    ),

    float: $ => seq(
      optional("-"),
      /\d+/,
      ".",
      /\d+/
    ),

    integer: $ => seq(
      optional("-"),
      /\d+/
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
