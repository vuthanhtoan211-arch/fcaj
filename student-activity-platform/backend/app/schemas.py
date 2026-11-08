from typing import Literal, Optional

from pydantic import BaseModel


class ScanRequest(BaseModel):
    mssv: str


class DecisionRequest(BaseModel):
    decision: Literal[
        "CONFIRMED",
        "REJECTED"
    ]

    note: Optional[str] = None