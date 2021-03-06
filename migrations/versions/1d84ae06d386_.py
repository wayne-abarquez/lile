"""empty message

Revision ID: 1d84ae06d386
Revises: 48ba1f90c512
Create Date: 2016-04-29 17:30:21.551247

"""

# revision identifiers, used by Alembic.
revision = '1d84ae06d386'
down_revision = '48ba1f90c512'

from alembic import op
import sqlalchemy as sa


def upgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.create_table('layer_overlay',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('date_created', sa.DateTime(), nullable=True),
    sa.Column('date_modified', sa.DateTime(), nullable=True),
    sa.Column('layer_id', sa.Integer(), nullable=False),
    sa.Column('json_content', sa.Text(), nullable=True),
    sa.ForeignKeyConstraint(['layer_id'], ['layer_file.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    ### end Alembic commands ###


def downgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('layer_overlay')
    ### end Alembic commands ###
