vec2 csin_slow(vec2 z) { return vec2(sin(z.x) * cosh(z.y), cos(z.x) * sinh(z.y)); }
vec2 ccos_slow(vec2 z) { return vec2(cos(z.x) * cosh(z.y), -sin(z.x) * sinh(z.y)); }
vec2 csinw(vec2 z, vec2 w) { return cpow(csin(z), w); }
vec2 ccosw(vec2 z, vec2 w) { return cpow(ccos(z), w); }
vec2 csinhw(vec2 z, vec2 w) { return cpow(csinh(z), w); }
vec2 ccoshw(vec2 z, vec2 w) { return cpow(ccosh(z), w); }
vec2 ctanw(vec2 z, vec2 w, vec2 s) { return cmul(cpow(csin(z), s), cpow(ccos(z), w)); } // ctos
vec2 ccotw(vec2 z, vec2 w, vec2 s) { return cmul(cpow(ccos(z), s), cpow(csin(z), w)); }
vec2 ctanhw(vec2 z, vec2 w, vec2 s) { return cmul(cpow(csinh(z), s), cpow(ccosh(z), w)); } // ctosh
vec2 ccothw(vec2 z, vec2 w, vec2 s) { return cmul(cpow(ccosh(z), s), cpow(csinh(z), w)); }
vec2 ccot(vec2 z) { return cinv(ctan(z)); }
vec2 ccomp_dim(vec2 z, vec2 w) { return cre(z) * cim(w) - cim(w) * cre(z); }
vec2 cgamma_div_digamma(vec2 z) { return cmul(cgamma(z), cinv(cdigamma(z))); }
vec2 cdigamma_div_gamma(vec2 z) { return cmul(cdigamma(z), cinv(cgamma(z))); }
vec2 czeta1(vec2 z) { return cmul(czeta(z), cinv(czeta_derv(z))); }
vec2 czeta2(vec2 z) { return cmul(czeta_derv(z), cinv(czeta(z))); }

vec4 bimul(vec4 z, vec4 w) { return bifromid(cmul(bitoid_left(z), bitoid_left(w)), cmul(bitoid_right(z), bitoid_right(w))); }
vec4 biarg_test(vec4 z) { vec2 u = cmul_i(bidiv(z.zw, z.xy)); vec2 arg = cmul_i(clog(bidiv(vec2(1.0, 0.0) - u, vec2(1.0, 0.0) + u))) * 0.5; return vec4(0.0, 0.0, arg.x, arg.y); }
