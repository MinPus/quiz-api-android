from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class User(Base):
    __tablename__ = 'user'

    id_user = Column(Integer, primary_key=True, autoincrement=True)
    name_user = Column(String(255), nullable=False)
    user_account = Column(String(255), unique=True, nullable=False)
    pword_account = Column(String(255), nullable=False)

    ke_hoach = relationship("KeHoach", back_populates="user", cascade="all, delete")

class KeHoach(Base):
    __tablename__ = 'ke_hoach'

    id_plan = Column(Integer, primary_key=True, autoincrement=True)
    name_plan = Column(String(255), nullable=False)
    noidung = Column(Text)
    ngaygiobatdau = Column(DateTime, nullable=False)
    ngaygioketthuc = Column(DateTime, nullable=False)
    id_user = Column(Integer, ForeignKey('user.id_user', ondelete='CASCADE'))

    user = relationship("User", back_populates="ke_hoach")