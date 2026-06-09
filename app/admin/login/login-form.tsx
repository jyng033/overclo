"use client";

import { useActionState } from "react";
import { signInAdmin } from "../actions";

export function LoginForm() {
  const [message, formAction, pending] = useActionState(signInAdmin, null);

  return (
    <form className="admin-form" action={formAction}>
      <label>
        이메일
        <input name="email" type="email" autoComplete="email" required />
      </label>
      <label>
        비밀번호
        <input name="password" type="password" autoComplete="current-password" required />
      </label>
      {message ? <p className="admin-error">{message}</p> : null}
      <button type="submit" disabled={pending}>
        {pending ? "확인 중" : "로그인"}
      </button>
    </form>
  );
}
