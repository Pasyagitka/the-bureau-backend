import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brigadier } from 'src/brigadier/entities/brigadier.entity';
import { NotExistsError } from 'src/common/exceptions';
import { Tool } from 'src/tool/entities/tool.entity';
import { Repository } from 'typeorm';
import { CreateRentalDto } from './dto/create-rental.dto';
import { RentalQueryDto } from './dto/rental-query.dto';
import { Rental } from './entities/rental.entity';

@Injectable()
export class RentalService {
  constructor(
    @InjectRepository(Rental)
    private rentalRepository: Repository<Rental>,
    @InjectRepository(Tool)
    private toolRepository: Repository<Tool>,
    @InjectRepository(Brigadier)
    private brigadierRepository: Repository<Brigadier>,
  ) {}

  async open(createRentalDto: CreateRentalDto) {
    const tool = await this.toolRepository.findOne({
      where: { id: createRentalDto.toolId },
    });
    if (!tool) throw new NotExistsError('tool');

    const brigader = await this.brigadierRepository.findOne({
      where: { id: createRentalDto.brigadierId },
    });
    if (!brigader) throw new NotExistsError('brigader');
    const item = this.rentalRepository.create(createRentalDto);
    item.tool = tool;
    item.brigadier = brigader;
    item.quantity = createRentalDto.quantity;
    item.startDate = createRentalDto.startDate;
    item.endDate = createRentalDto.endDate;
    return await this.rentalRepository.save(item);
  }

  findAll(query: RentalQueryDto) {
    return this.rentalRepository.find({
      where: {
        brigadier: {
          id: query.brigadierId,
        },
        isApproved: query.isApproved,
      },
      relations: {
        tool: true,
        brigadier: true,
      },
      order: { id: 'ASC' },
    });
  }

  async approve(id: number) {
    //todo
    const rental = await this.rentalRepository.findOne({ where: { id } });
    if (!rental) throw new NotExistsError('rental');
    rental.isApproved = true;
    return this.rentalRepository.save(rental);
  }

  async close(id: number) {
    //todo
    const item = await this.rentalRepository.findOne({
      where: { id }, //relations
    });
    if (!item) throw new NotExistsError('rental');
    return await this.rentalRepository.softRemove(item);
  }
}
