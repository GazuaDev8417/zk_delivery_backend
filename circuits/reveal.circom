pragma circom 2.0.0;

include "circomlib/circuits/poseidon.circom";

template Reveal() {
    signal input code;
    signal output hash;

    component poseidon = Poseidon(1);
    poseidon.inputs[0] <== code;

    hash <== poseidon.out;
}

component main = Reveal();