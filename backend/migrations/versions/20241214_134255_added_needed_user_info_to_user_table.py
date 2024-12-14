"""added needed user info to User table

Revision ID: 07188041d527
Revises: ffdc0a98111c
Create Date: 2024-12-14 13:42:55.159938

"""
from alembic import op
import sqlalchemy as sa
import os

SCHEMA = os.environ.get("SCHEMA")
environment = os.getenv("FLASK_ENV")


# revision identifiers, used by Alembic.
revision = '07188041d527'
down_revision = 'ffdc0a98111c'
branch_labels = None
depends_on = None

def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    if environment == "production" and SCHEMA:
        with op.batch_alter_table('users', schema=SCHEMA) as batch_op:
            batch_op.add_column(sa.Column('fname', sa.String(length=40), nullable=False))
            batch_op.add_column(sa.Column('lname', sa.String(length=40), nullable=False))
            batch_op.add_column(sa.Column('address', sa.String(length=255), nullable=False))
            batch_op.add_column(sa.Column('city', sa.String(length=100), nullable=False))
            batch_op.add_column(sa.Column('state', sa.String(length=40), nullable=False))
            batch_op.add_column(sa.Column('zip', sa.Integer(), nullable=False))
            batch_op.add_column(sa.Column('staff', sa.Boolean(), default=False))
            batch_op.add_column(sa.Column('position', sa.String(length=40), default=None))
    else:
        # If not using production or if no schema, just alter table directly without schema
        with op.batch_alter_table('users') as batch_op:
            batch_op.add_column(sa.Column('fname', sa.String(length=40), nullable=False))
            batch_op.add_column(sa.Column('lname', sa.String(length=40), nullable=False))
            batch_op.add_column(sa.Column('address', sa.String(length=255), nullable=False))
            batch_op.add_column(sa.Column('city', sa.String(length=100), nullable=False))
            batch_op.add_column(sa.Column('state', sa.String(length=40), nullable=False))
            batch_op.add_column(sa.Column('zip', sa.Integer(), nullable=False))
            batch_op.add_column(sa.Column('staff', sa.Boolean(), default=False))
            batch_op.add_column(sa.Column('position', sa.String(length=40), default=None))

    # ### end Alembic commands ###

def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    if environment == "production" and SCHEMA:
        with op.batch_alter_table('users', schema=SCHEMA) as batch_op:
            batch_op.drop_column('position')
            batch_op.drop_column('staff')
            batch_op.drop_column('zip')
            batch_op.drop_column('state')
            batch_op.drop_column('city')
            batch_op.drop_column('address')
            batch_op.drop_column('lname')
            batch_op.drop_column('fname')
    else:
        # If not using production or if no schema, just alter table directly without schema
        with op.batch_alter_table('users') as batch_op:
            batch_op.drop_column('position')
            batch_op.drop_column('staff')
            batch_op.drop_column('zip')
            batch_op.drop_column('state')
            batch_op.drop_column('city')
            batch_op.drop_column('address')
            batch_op.drop_column('lname')
            batch_op.drop_column('fname')

    # ### end Alembic commands ###

# def upgrade():
#     # ### commands auto generated by Alembic - please adjust! ###
#     if environment == "production" and SCHEMA:
#         with op.batch_alter_table('users', schema=SCHEMA) as batch_op:
#             batch_op.add_column(sa.Column('fname', sa.String(length=40), nullable=False, default=''))
#             batch_op.add_column(sa.Column('lname', sa.String(length=40), nullable=False, default=''))
#             batch_op.add_column(sa.Column('address', sa.String(length=255), nullable=False, default=''))
#             batch_op.add_column(sa.Column('city', sa.String(length=100), nullable=False, default=''))
#             batch_op.add_column(sa.Column('state', sa.String(length=40), nullable=False, default=''))
#             batch_op.add_column(sa.Column('zip', sa.Integer(), nullable=False, default=10000))
#             batch_op.add_column(sa.Column('staff', sa.Boolean(), nullable=False,))
#             batch_op.add_column(sa.Column('position', sa.String(length=40), default="Client"))
#     else:
#         # If not using production or if no schema, just alter table directly without schema
#         with op.batch_alter_table('users') as batch_op:
#             batch_op.add_column(sa.Column('fname', sa.String(length=40), nullable=False, default=''))
#             batch_op.add_column(sa.Column('lname', sa.String(length=40), nullable=False, default=''))
#             batch_op.add_column(sa.Column('address', sa.String(length=255), nullable=False, default=''))
#             batch_op.add_column(sa.Column('city', sa.String(length=100), nullable=False, default=''))
#             batch_op.add_column(sa.Column('state', sa.String(length=40), nullable=False, default=''))
#             batch_op.add_column(sa.Column('zip', sa.Integer(), nullable=False, default=10000))
#             batch_op.add_column(sa.Column('staff', sa.Boolean(), nullable=False, default=False))
#             batch_op.add_column(sa.Column('position', sa.String(length=40), default="Client"))

#     # ### end Alembic commands ###


# def downgrade():
#     # ### commands auto generated by Alembic - please adjust! ###
#     if environment == "production" and SCHEMA:
#         with op.batch_alter_table('users', schema=SCHEMA) as batch_op:
#             batch_op.drop_column('position')
#             batch_op.drop_column('staff')
#             batch_op.drop_column('zip')
#             batch_op.drop_column('state')
#             batch_op.drop_column('city')
#             batch_op.drop_column('address')
#             batch_op.drop_column('lname')
#             batch_op.drop_column('fname')
#     else:
#         # If not using production or if no schema, just alter table directly without schema
#         with op.batch_alter_table('users') as batch_op:
#             batch_op.drop_column('position')
#             batch_op.drop_column('staff')
#             batch_op.drop_column('zip')
#             batch_op.drop_column('state')
#             batch_op.drop_column('city')
#             batch_op.drop_column('address')
#             batch_op.drop_column('lname')
#             batch_op.drop_column('fname')

#     # ### end Alembic commands ###

# def upgrade():
#     # ### commands auto generated by Alembic - please adjust! ###
#     with op.batch_alter_table('users', schema=SCHEMA) as batch_op:
#         batch_op.add_column(sa.Column('fname', sa.String(length=40), nullable=False))
#         batch_op.add_column(sa.Column('lname', sa.String(length=40), nullable=False))
#         batch_op.add_column(sa.Column('address', sa.String(length=255), nullable=False))
#         batch_op.add_column(sa.Column('city', sa.String(length=100), nullable=False))
#         batch_op.add_column(sa.Column('state', sa.String(length=40), nullable=False))
#         batch_op.add_column(sa.Column('zip', sa.Integer(), nullable=False))
#         batch_op.add_column(sa.Column('staff', sa.Boolean(), nullable=False))
#         batch_op.add_column(sa.Column('position', sa.String(length=40), nullable=True, default=None))

#     # ### end Alembic commands ###


# def downgrade():
#     # ### commands auto generated by Alembic - please adjust! ###
#     with op.batch_alter_table('users', schema=SCHEMA) as batch_op:
#         batch_op.drop_column('position')
#         batch_op.drop_column('staff')
#         batch_op.drop_column('zip')
#         batch_op.drop_column('state')
#         batch_op.drop_column('city')
#         batch_op.drop_column('address')
#         batch_op.drop_column('lname')
#         batch_op.drop_column('fname')

#     # ### end Alembic commands ###
